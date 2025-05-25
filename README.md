# Kinopio-tampermonkey-shortcuts
//Additional shortcuts for Kinopio//

Hey everyone

I've created a browser script that adds some extra keyboard shortcuts to Kinopio (not working for desktop app).

Checkbox (Toggle): Alt + Q  
Connection Type: Alt + W  
Tags: Alt + E  
Color: Alt + R  
H1 (Header 1): Alt + A  
H2 (Header 2): Alt + S  
Sidebar: Alt + D  
Frame -> Garden Leaves: Alt + Z  
Image: Alt + X  
Copy Card Names: Alt + C (original ctrl+c is buggy for me)  
Merge: Alt + V  
Split Card: Alt + G  
Spaces: Alt + `  

To get them working, you'll need to:

1. Download the Tampermonkey browser extension.   
2. Create a new script in Tampermonkey and paste in this code.  
3. Restart browser

Everything is working for me in Edge on Windows 11. It might not work for everyone, as the shortcuts could potentially conflict if they are already assigned to other functions on your system or in your browser.  
This script relies on the current HTML structure and element attributes of the Kinopio website. Future updates to Kinopio may change this structure and could require the script to be updated to continue working correctly.  
To change the shortcuts to the ones you want, just drop the code from TampermonkeyScript.user.js into Gemini and ask it to do it for you!
