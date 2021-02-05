function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var menuEntries = [
    { name: 'Process Search Console E-mails', functionName: 'processEmails' }
  ]
  ss.addMenu('Search Console E-mails', menuEntries)
}

/**
 * Fetch unread threads, mark them read, move them to archive and append them to a sheet
 */
function processEmails() {
  const query = 'from:sc-noreply@google.com is:unread' // search query -- unread messages from the Search Console
  const sheetName = 'Threads' // a name of the sheet, in which the threads should be listed
  const listHeader = ['Last Date', 'Subject', 'Website', 'Subject Pattern', 'Link'] // thread list headers
  const reUrl = /https?:\/\/[-a-z0-9./]+\//
  const reSite = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/

  // fetch trhreads from Gmail
  const threadList = GmailApp.search(query, 0, 100)

  if (threadList.length > 0) {
    // build an output data table, mark threads read and archive them
    const threadTable = []
    threadList.forEach(thread => {
      // build the output table
      const subject = thread.getFirstMessageSubject()
      var websiteMatch = subject.match(reUrl) || subject.match(reSite)
      if (!Array.isArray(websiteMatch)) {
        const body = thread.getMessages()[0].getPlainBody()
        websiteMatch = body.match(reUrl) || body.match(reSite)
      }
      const website = Array.isArray(websiteMatch) ? websiteMatch[0] : null
      const subjectPattern = subject.replace(website, '[website]')
      threadTable.push([
        thread.getLastMessageDate(),
        subject,
        website,
        subjectPattern,
        thread.getPermalink()
      ])
      // mark thread read and archive it if in inbox
      thread.markRead()
      if (thread.isInInbox()) {
        thread.moveToArchive()
      }
    })

    // append the output table to the sheet
    const ss = SpreadsheetApp.getActive()
    const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName)
    var lastRow = sheet.getLastRow()
    if (lastRow < 1) {
      // the sheet is empty -> insert headers
      sheet.appendRow(listHeader)
      lastRow++
    }
    const range = sheet.getRange(lastRow + 1, 1, threadTable.length, threadTable[0].length)
    range.setValues(threadTable)
    sheet.activate()
  }
}
