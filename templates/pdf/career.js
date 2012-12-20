var cfg = require('./config');

exports.render = function(doc, data) {
  for(i=0; i<data.positions.values.length; i++) {
    cur = data.positions.values[i];
    doc.moveUp(1);
    doc.
      fillColor(cfg.color.orange).
      font(cfg.font.boldface).
      fontSize(cfg.font.h3).
      text(cur.company.name, cfg.column.two.start);
    doc.
      fillColor(cfg.color.default).
      fontSize(cfg.font.small).
      moveUp(0.2);
    doc.
      text(cur.title).
      moveDown(0.2);
    var endy;
    if(cur.endDate) {
      endy = cur.endDate.monthname + ' ' + cur.endDate.year; 
    }
    else {
      endy = 'Current';
    }
    doc.
      fillColor(cfg.color.gray).
      fontSize(cfg.font.h4).
      moveUp(1).
      text(
        cur.startDate.monthname + ' ' + 
        cur.startDate.year + ' - ' +
        endy,
        { align: 'right', width: cfg.column.two.width }
      );
    doc.
      fillColor(cfg.color.default).
      font(cfg.font.face).
      fontSize(cfg.font.small).
      text(cur.summary, { align: 'left', width: cfg.column.two.width - 50 });
    doc.moveDown(2.5);
  }
  return(doc);
};
