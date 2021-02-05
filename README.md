# Google Search Console e-mails logger

Google Apps Script which checks Gmail, finds unread e-mails from Google Search Console, logs them in a spreadsheet, marks them as read and archives them.

I've made this script for people that have access to a lot of Search Console properties and receive tens or hundreds e-mail notifications from the Search Console every months. The script helps you keep your inbox clean and moves informations to a Data Studio report which you can easily set up.

**Use it on your own risk and only if you know, what exactly it does.** The script is beta, it may contain bugs. Please report any issues you find. Thank you!

## How to install the script and how to make it work

1. Create a new Google Spreadsheet on your Google Drive.
1. Open the script editor (menu *Tools* -> *Script editor*)
1. Replace the content of the Code.gs file in the editor with the content of the file [src/Code.js](https://github.com/MarekProkop/search-console-emails/blob/main/src/Code.js).
1. Save the file and close the editor.
1. Reload the spreadsheets. *Search Console Emails* should appear in the main menu.
1. Now you can call the script from the menu manually.

In addition you may want to call the script automatically, e.g. once a day. To set up that, do the following:

1. Open the spreadsheet and associated script editor again.
1. On the left-hand navigation bar select the clock icon. This opens the *Triggers* window.
1. Push the *Add Trigger* button in the bottom right corner. A pop-up window appears.
1. Choose which function to run: *processEmails*
1. Choose which deployment should run: leave as it is.
1. Select event source: *Time-driven*
1. Select type of time based trigger: *Day timer*
1. Select time of day: whatever you like.

You can set up another time based trigger(s) as you wish. Bear in mind the script may need up to one minute to run and Google Apps Script has a time lmit for running triggers (90 minutes a day for Gmail accounts).

## What the script does

Every time the script runs, the following things happen:

1. Up to 100 **unread** e-mails from sc-noreply@google.com are retrieved from your Gmail, marked as read and archived.
1. In addition those e-mails are logged into the spreadsheet. Logged information includes: date, subject, URL or domain which is mentioned in the e-mail, subject pattern and link to the message in Gmail.

If you have more than 100 unread e-mails from sc-noreply@google.com, only 100 of them will be processed in one run. The next run will process the rest.

## Integration with Google Data Studio

I recommend to create a report in Google Data Studio, which connects to the spreadsheet and visualise its data. I will publish a sample report some day.

