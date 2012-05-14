var cfg = require('./config');

exports.render = function(doc, data) {
  doc.moveDown(6);
  doc.
    fillColor(cfg.color.orange).
    font(cfg.font.boldface).
    fontSize(cfg.font.h3).
    moveUp(1.2).
    text('Awards', cfg.column.two.start);
  doc.moveDown(0.5);
  
  data.honorsAwards.values.forEach(function(awd, idx) {
    doc.
      fillColor(cfg.color.default).
      font(cfg.font.boldface).
      fontSize(cfg.font.small).
      text(awd.date.year);
    doc.
      font(cfg.font.face).
      text(awd.name);
    doc.
      fillColor(cfg.color.gray).
      text(awd.issuer);
    if(awd.occupation.schoolName) {
      doc.text(awd.occupation.schoolName);
    }
    doc.moveDown(1);
  });

  return(doc);
};
