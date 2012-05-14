var cfg = require('./config');

exports.render = function(doc, data) {
  doc.moveUp(17.8);
  doc.
    fillColor(cfg.color.orange).
    font(cfg.font.boldface).
    fontSize(cfg.font.h3).
    moveUp(1.2).
    text('Groups', cfg.column.two.start + 170);
  doc.moveDown(0.5);
 
  data.organizationsMemberships.values.forEach(function(grp, idx) {
    doc.
      fillColor(cfg.color.default).
      font(cfg.font.boldface).
      fontSize(cfg.font.small).
      text(grp.startDate.year);
    doc.
      font(cfg.font.face).
      text(grp.name, { width: 105 });
    if(grp.description) {
      doc.text(grp.description, { width: 105 });
    }
    doc.fillColor(cfg.color.gray);
    if(grp.occupation && grp.occupation.position) {
      doc.text(grp.occupation.position.company.name); 
    } 
    else if(grp.occupation && grp.occupation.education) {
      doc.text(grp.occupation.education.schoolName);
    }
    doc.moveDown(1);
  });

  return(doc);
};
