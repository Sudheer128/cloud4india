const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

// Original privacy policy content
const originalContent = `<h2>Privacy Policy</h2><p>Read Cloud4India's Privacy Policy to understand how we collect, use, & protect your personal information. Transparency & data security are our priorities.</p><h2>Privacy & Policy</h2><p>Effective date: 1 January 2024</p><p>CLOUD 4 INDIA is committed to protecting the personal information of our customers, employees and other individuals. When you conduct business with CLOUD 4 INDIA You can be assured that your privacy is protected. We respect your right to control the collection and use and disclosure of your personal information. CLOUD 4 INDIA is committed to protecting your privacy and safeguarding your personal information. CLOUD 4 INDIA has implemented the below "Privacy Code" to comply with the Personal Information. Protection and Electronic Documents Act (PIPEDA) which came into effect January 1, 2004. CLOUD 4 INDIA respects the privacy of our clients and we are committed to keeping your personal information private, secure, accurate, and confidential.</p><h2>What Is Personal Information?</h2><p>Personal information includes any factual or subjective information, recorded or not, about an identifiable individual. This includes information in any form, such as: age, name, ID numbers, income, ethnic origin, or blood type, opinions, evaluations, comments, social status, or disciplinary actions, employee files, credit records, loan records, medical records, existence of a dispute between a consumer and a, intentions (for example, to acquire goods or services, or change jobs), Personal information does not include the name, title, business address or telephone number of an employee of an organization.</p><h2>Information We May Collect And What We Do With Such Information</h2><p>We collect and use information about you and your use of our website and our products and services (herein called "Information") to:<br>(i) initiate and maintain a business relationship with you as our customer in connection with our products and services.<br>(ii) Provide you with personalized services and product offerings by use of direct marketing to our current customer base, as well as new potential customers.<br>(iii) Comply with any legal requirements or requests due to a legal proceeding.</p><p>The Personal Information Protection and Electronic Documents Act utilizes the model code from the Canadian Standards Association(CSA). The code was developed by business, consumers, academics and government under the auspices of the Canadian Standards Association. It lists 10 principles of fair information practices, which form ground rules for the collection, use and disclosure of personal information. These principles give individuals control over how their personal information is handled in the private sector. An organization is responsible for the protection of personal information and the fair handling of it at all times, throughout the organization and in dealings with third parties. Care in collecting, using and disclosing personal information is essential to continued consumer confidence and good will.</p><p>To view the Personal Information and Electronic Document Act, click here now.</p><h2>CLOUD 4 INDIA takes our Privacy code seriously, which is based on the below 9 principles:</h2><ol>
  <li><strong>Accountability</strong><br>
  CLOUD 4 INDIA is responsible for information under our control. We have assigned an individual who is accountable for our organization's compliance to the Privacy Principles set out by the Personal Information Protection and Electronic Documents Act.</li>
  
  <li><strong>Identifying purposes</strong><br>
  Whenever we collect information from a customer or potential customer we identify the purpose for which the information will be used.</li>
  
  <li><strong>Consent</strong><br>
  Consent and knowledge of the individual is required before we collect or disclose any personal information, except in cases where it is inappropriate.</li>
  
  <li><strong>Limiting collection</strong><br>
  We only collect information that is necessary for the purpose identified by our organization.</li>
  
  <li><strong>Limiting use, disclosure, and retention</strong><br>
  Just as CLOUD 4 INDIA takes steps to limit the types of information we collect from you, we carefully regulate how we handle your personal information. We do not use your information for purposes other than those to which you have consented, or as required by law (for example in a legal investigation). Should CLOUD 4 INDIA require the services of third parties to handle your information, we will require them to adhere to privacy procedures that will keep your information confidential. These third parties will be given only the information necessary for performing their information-handling services. CLOUD 4 INDIA does not sell or trade personal information for commercial purposes. CLOUD 4 INDIA is committed to retaining your personal information only as long as is necessary for the purposes for which it was collected. CLOUD 4 INDIA is also committed to deleting or destroying the records containing that information when they are no longer required; this will be done in ways that will ensure your continued privacy.</li>
  
  <li><strong>Accuracy</strong><br>
  We are committed to ensuring that our records of your personal information are accurate, complete, and up-to-date. Although it is your responsibility to inform CLOUD 4 INDIA of any relevant changes in your personal information, we will take steps to ensure that you are able from time to time to verify the information in your file.</li>
  
  <li><strong>Safeguards</strong><br>
  CLOUD 4 INDIA uses appropriate safeguards to protect the privacy of your personal information. These safeguards are designed to prevent unauthorized access, disclosure, copying, use, or modification. Your records are accessible only to staff who have been given the authority to access them and only as is necessary to provide services to you.</li>
  
  <li><strong>Openness</strong><br>
  So that you can be confident that CLOUD 4 INDIA is handling your personal information appropriately, CLOUD 4 INDIA will make information about its policies and practices concerning management of personal information readily available to you. As such, CLOUD 4 INDIA lists our policies on our website for viewing 24 hours a day, 7 days a week for reading by all.</li>
  
  <li><strong>Individual access</strong><br>
  If at any time you have a question about our records containing your personal information, we will do our best to answer it. You have the right to be told about the kind of personal information. CLOUD 4 INDIA maintains, how it is used, and with whom it is shared. You are entitled to challenge the factual accuracy as well as the completeness and relevance of our records. Incorrect information will be promptly corrected or, if necessary, deleted. In special circumstances, CLOUD 4 INDIA may need to refuse or limit an access request, for example when disclosure of the information will reveal personal information about another person or interfere with a legal investigation. Most inquiries about our records containing your personal information will be answered at no cost to you. In special circumstances, however, it may be necessary to charge a fee, for example when a lot of staff time is required to gather requested information. If a fee is necessary, you will be told in advance.</li>
</ol>`;

console.log('🔄 Restoring original Privacy Policy content...');

db.serialize(() => {
  db.run("UPDATE integrity_pages SET content = ? WHERE id = 1", [originalContent], function(err) {
    if (err) {
      console.error('❌ Error restoring content:', err.message);
    } else {
      console.log('✅ Successfully restored Privacy Policy content');
      console.log('   Rows updated:', this.changes);
    }
    
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('✅ Database connection closed');
      }
    });
  });
});

