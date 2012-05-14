var cfg = require('./config');

exports.render = function(doc, data) {
  doc.moveUp(1);
  doc.
    fillColor(cfg.color.orange).
    font(cfg.font.boldface).
    fontSize(cfg.font.h3).
    text('Current Tech', cfg.column.two.start);

  var skills = [];
  for(i=0; i<data.skills.values.length; i++) {
    cur = data.skills.values[i].skill.name;
    skills.push(cur); 
  }
  doc.
    moveDown(0.33).
    fillColor(cfg.color.default).
    font(cfg.font.face).
    fontSize(cfg.font.small).
    text(skills.join(', ') + '.', { width: cfg.column.two.width - 50 });
  
  return(doc);
};
