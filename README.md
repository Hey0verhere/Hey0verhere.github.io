---
layout: default
---

<p id="who">Hi welcome.</p>
<button type="button" id="color" onclick="randomColorAndPosition()">X</button>

<style>
    #color {
        position: absolute;
        border-radius: 50px;
        padding: 10px 25px;
        left: 1578px;
        top : 230px;
        color: black;
        border: none;
        cursor: pointer;
    }
</style>

<div class="blog-container">
    <aside class="sidebar">
        <nav>
            <ul>
                <li><a href="./machines.html">Write Ups</a></li>
                <br>
                <li><a href="#" id="btn-personal">Personal</a></li>
                <br>
            </ul>
        </nav>
    </aside>
</div>

<style>
    .hidden {
        display: none;
    }

    .container {
        display: flex;
        gap: 20px;
        padding: 20px;
    }

    .main-content {
        flex: 3;
        height: 2000px; 
        padding: 20px;
    }

    .sidebar {
        flex: 1;
    }

    .profile-img {
        width: 100px; 
        height: auto; 
        border-radius: 50%; 
        margin-bottom: 10px;
        object-fit: cover;
    }

    .sticky-element {
        text-align: center;
        position : sticky;
        top: 20px;
        padding: 15px;
    }
</style>

<div class="container">
    <div class="main-content">
        <br><br>
        <h3>Penetration Testing</h3>
        <p>
            I am and I always will be someone with curious mind.<br>
            I try to understand how everything works and why it works like this, even in my personal life.<br>
            So here I am trying to help others as I can with my Write-Ups. <br>
            At the same time I try to learn more and be a better version of myself.<br> <br>
            I achieved CPTS from HTB at September of 2025.
        </p>
    </div>
</div>

<script src="ColorFlipper.js"></script>
<script src="hiddenIndex.js"></script>
