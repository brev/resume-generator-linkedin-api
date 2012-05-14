var about = require('./about'),
    awards = require('./awards'),
    career = require('./career'),
    cfg = require('./config'),
    groups = require('./groups'),
    school = require('./school'),
    skills = require('./skills'); 


var _header = function(doc, data) {
  // FNAME
  var y = cfg.margin.top;
  doc.
    font(cfg.font.boldface).
    fontSize(cfg.font.h1).
    fillColor(cfg.color.orange).
    text(data.firstName.toUpperCase(), cfg.column.three.start - 3, y, {characterSpacing: -4});
  // summary
  y += 37;
  doc.
    fillColor(cfg.color.gray).
    font('Helvetica').
    fontSize(cfg.font.small). 
    text(data.summary, cfg.column.three.start, y, {characterSpacing: 1, align: 'right'}); 
  return doc;
};


exports.render = function(fn, data) {
  var PDFDocument = require('pdfkit');
  var doc = new PDFDocument({margins: 0});

  /**
   * 3rd column, far right: NAME, summary, contact info, etc.
   */
  doc = _header(doc, data);

  // full name
  var y = cfg.margin.top + cfg.padding.giant + 5;
  doc.
    fillColor(cfg.color.default).
    font(cfg.font.boldface).
    text(data.firstName + ' ' + data.lastName, cfg.column.three.start, y);
 
  // url 
  y += cfg.padding.medium;
  str = data.memberUrlResources.values[0].url;
  doc.
    fillColor(cfg.color.orange).
    font('Helvetica').
    text(str, cfg.column.three.start, y);  
  var w = doc.widthOfString(str);
  var h = doc.currentLineHeight();
  doc.link(cfg.column.three.start, y, w, h, str);

  // linkedin
  y += cfg.padding.small;
  str = 'LinkedIn Profile';
  doc.text(str, cfg.column.three.start, y);  
  var w = doc.widthOfString(str);
  var h = doc.currentLineHeight();
  doc.link(cfg.column.three.start, y, w, h, data.publicProfileUrl);

  // email
  y += cfg.padding.medium;
  str = 'me@brev.name';
  doc.text(str, cfg.column.three.start, y);  
  var w = doc.widthOfString(str);
  var h = doc.currentLineHeight();
  doc.link(cfg.column.three.start, y, w, h, 'mailto:' + str);

  // phone
  y += cfg.padding.medium; 
  doc.
    fillColor(cfg.color.default).
    text(data.phoneNumbers.values[0].phoneNumber, cfg.column.three.start, y);  
  
  // city, state / country
  y += cfg.padding.medium;
  doc.text(data.city + ', ' + data.state, cfg.column.three.start, y);
  y += cfg.padding.small;
  doc.text(data.country, cfg.column.three.start, y);

  // last updated
  y += cfg.padding.medium;
  doc.
    fillColor(cfg.color.gray).
    text('Last Updated:', cfg.column.three.start, y);
  y += cfg.padding.small;
  doc.text(data.today, cfg.column.three.start, y);

  // page 1 of 2
  y += cfg.padding.medium;
  doc.
    moveDown(1).
    text('Page 1 of 2');

  /**
   * 1st column, Career header + stroke
   */ 
  // career
  y = cfg.padding.giant + cfg.margin.top;
  doc.
    moveTo(cfg.margin.left, y).
    lineTo(cfg.column.three.start - cfg.padding.large, y).
    lineWidth(1).
    strokeColor(cfg.color.strokegray).
    stroke();
  doc.
    fillColor(cfg.color.litegray).
    font(cfg.font.boldface).
    fontSize(cfg.font.h2).
    text('CAREER', cfg.column.one.start, y + cfg.padding.small - 3);
  doc = career.render(doc, data); 
 
  // skills 
  doc.
    moveTo(cfg.column.one.start, 504).
    lineTo(cfg.column.three.start - cfg.padding.large, 504).
    lineWidth(1).
    strokeColor(cfg.color.strokegray).
    stroke();
  doc.
    fillColor(cfg.color.litegray).
    font(cfg.font.boldface).
    fontSize(cfg.font.h2).
    moveDown(1).
    text('SKILLS', cfg.column.one.start); 
  doc = skills.render(doc, data); 
 
  /**
   * Page 2
   */
  doc.addPage();
  doc = _header(doc, data);
  doc.
    moveDown(3).
    text('Page 2 of 2'); 
  
  //  effort 
  y = cfg.margin.top + cfg.padding.giant;
  doc.
    moveTo(cfg.column.one.start, y).
    lineTo(cfg.column.three.start - cfg.padding.large, y).
    lineWidth(1).
    strokeColor(cfg.color.strokegray).
    stroke();
  doc.
    moveUp(4).
    fillColor(cfg.color.litegray).
    font(cfg.font.boldface).
    fontSize(cfg.font.h2).
    moveDown(1.33).
    text('EFFORT', cfg.column.one.start); 
  doc = school.render(doc, data); 
  doc = groups.render(doc, data); 
  doc = awards.render(doc, data); 
  doc = about.render(doc, data); 
 
  /**
   * Save off PDF file
   */ 
  doc.write(fn);
};
