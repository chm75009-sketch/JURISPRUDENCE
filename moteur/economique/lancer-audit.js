const fs=require("fs"); const audit=require("./audit-client.js");
const f=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));
const items=audit(f);
fs.writeFileSync("_audit_items.js","module.exports="+JSON.stringify(items)+";");
fs.writeFileSync("_audit_items.json",JSON.stringify(items));
console.log("items :",items.length);
