var cfg = require('./config');

exports.render = function(doc, data) {
  doc.
    fillColor(cfg.color.orange).
    font(cfg.font.boldface).
    fontSize(cfg.font.h3).
    moveUp(1.2).
    text('School', cfg.column.two.start);
  doc.moveDown(0.5);
  
  edu = data.educations.values[0];
  doc.
    fillColor(cfg.color.default).
    fontSize(cfg.font.small).
    text(edu.startDate.year);
  doc.
    font(cfg.font.face).
    text(data.major + ' ' + edu.degree);
  doc.text(data.minor + ' Minor');
  doc.
    fillColor(cfg.color.gray).
    text(edu.schoolName);
  doc.moveDown(1);

  data.certifications.values.forEach(function(cert, idx) {
    doc.
      fillColor(cfg.color.default).
      font(cfg.font.boldface).
      text(cert.startDate.year);
    doc.
      font(cfg.font.face).
      text(cert.name);
    doc.
      fillColor(cfg.color.gray).
      text(cert.authority.name);
    doc.moveDown(1);
  });

  return(doc);
};
