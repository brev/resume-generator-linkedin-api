var cfg = require('./config');

exports.render = function(doc, data) {
  doc.
    fillColor(cfg.color.orange).
    font(cfg.font.boldface).
    fontSize(cfg.font.h3).
    moveUp(1.2).
    text('School', cfg.column.two.start);
  doc.moveDown(0.5);
  
  data.certifications.values.forEach(function(cert, idx) {
    var datest = cert.endDate ? cert.endDate.year : cert.startDate.year; 
    doc.
      fillColor(cfg.color.default).
      font(cfg.font.boldface).
      fontSize(cfg.font.small).
      text(datest);
    doc.
      font(cfg.font.face).
      text(cert.name);
    if(cert.name2) {
      doc.text(cert.name2);
    }
    doc.
      fillColor(cfg.color.gray).
      text(cert.authority.name);
    doc.moveDown(1);
  });

  return(doc);
};
