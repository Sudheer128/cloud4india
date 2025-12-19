#!/usr/bin/env node

/**
 * Create database tables for Integrity Pages CMS
 * This script creates tables for Privacy Policy, AUP, MSA & SLA, Terms, Refund Policy
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path - use environment variable or default to local path
const DB_PATH = process.env.DB_PATH || './cms.db';

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Create tables
const createTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Integrity Pages table
      db.run(`CREATE TABLE IF NOT EXISTS integrity_pages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        is_visible INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Error creating integrity_pages table:', err.message);
          reject(err);
        } else {
          console.log('✅ Created integrity_pages table');
        }
      });

      // Privacy Policy default content
      const privacyContent = `<h1>Privacy Policy</h1>

<p>Read Cloud4India's Privacy Policy to understand how we collect, use, & protect your personal information. Transparency & data security are our priorities.</p>

<h2>Privacy & Policy</h2>

<p><strong>Effective date:</strong> 1 January 2024</p>

<p>CLOUD 4 INDIA is committed to protecting the personal information of our customers, employees and other individuals. When you conduct business with CLOUD 4 INDIA You can be assured that your privacy is protected. We respect your right to control the collection and use and disclosure of your personal information. CLOUD 4 INDIA is committed to protecting your privacy and safeguarding your personal information. CLOUD 4 INDIA has implemented the below "Privacy Code" to comply with the Personal Information. Protection and Electronic Documents Act (PIPEDA) which came into effect January 1, 2004. CLOUD 4 INDIA respects the privacy of our clients and we are committed to keeping your personal information private, secure, accurate, and confidential.</p>

<h3>What Is Personal Information?</h3>

<p>Personal information includes any factual or subjective information, recorded or not, about an identifiable individual. This includes information in any form, such as: age, name, ID numbers, income, ethnic origin, or blood type, opinions, evaluations, comments, social status, or disciplinary actions, employee files, credit records, loan records, medical records, existence of a dispute between a consumer and a, intentions (for example, to acquire goods or services, or change jobs), Personal information does not include the name, title, business address or telephone number of an employee of an organization.</p>

<h3>Information We May Collect And What We Do With Such Information</h3>

<p>We collect and use information about you and your use of our website and our products and services (herein called "Information") to:<br>
(i) initiate and maintain a business relationship with you as our customer in connection with our products and services.<br>
(ii) Provide you with personalized services and product offerings by use of direct marketing to our current customer base, as well as new potential customers.<br>
(iii) Comply with any legal requirements or requests due to a legal proceeding.</p>

<p>The Personal Information Protection and Electronic Documents Act utilizes the model code from the Canadian Standards Association(CSA). The code was developed by business, consumers, academics and government under the auspices of the Canadian Standards Association. It lists 10 principles of fair information practices, which form ground rules for the collection, use and disclosure of personal information. These principles give individuals control over how their personal information is handled in the private sector. An organization is responsible for the protection of personal information and the fair handling of it at all times, throughout the organization and in dealings with third parties. Care in collecting, using and disclosing personal information is essential to continued consumer confidence and good will.</p>

<p>To view the Personal Information and Electronic Document Act, click here now.</p>

<h3>CLOUD 4 INDIA takes our Privacy code seriously, which is based on the below 9 principles:</h3>

<ol>
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

      // Acceptance User Policy default content
      const aupContent = `<h1>Acceptance User Policy</h1>

<p>Any amendment or modification of this AUP shall be effective only if it is in writing and duly signed by both the Parties.</p>

<h2>Acceptance User Policy</h2>

<ol>
  <li>This Acceptable User Policy ("AUP") governs the usage of services of Cloud 4 India ("Services") pursuant to the Master Services Agreement dated Date entered between Cloud 4 India, hereby referred as 'Service Provider' and CUSTOMER NAME hereby referred to as 'Customer'.<br>
  The terms not specifically defined herein shall have the meanings ascribed to them in the Master Services Agreement.</li>
  
  <li>This AUP shall be incorporated by reference into each contract entered by CLOUD 4 INDIA with its Customer for availing the Services. In addition, this Policy shall also be incorporated by reference into the Master Service Agreement</li>
  
  <li>This AUP helps and protects the Customer. Availing of Services by the Customer constitutes acceptance of this AUP.</li>
  
  <li>All hosting services provided by CLOUD 4 INDIA shall be used by the Customer for lawful purposes only, and as per the applicable laws (including but not limited to privacy laws). Transmission, usage, storage, or presentation of any information, data or material in violation of applicable laws including the 'banned contents' is strictly prohibited. The 'banned contents' include but are not limited to:
    <ol type="a">
      <li><strong>Illegal Material</strong>– Includes illegally exploited copyrighted works, commercial audio, video, or music files, and any material that violates any applicable law or regulation of any country, and any material that is perceived to be misleading in any manner.</li>
      <li><strong>Warez</strong> – Includes, but is not limited to, pirated software, ROMS, emulators, phreaking, hacking, password cracking, IP spoofing and the like, and encrypting of any of the above. It also includes any sites which provide "links to" or "how to" information about such material.</li>
      <li><strong>HYIP</strong> – HYIP sites, or sites that link to or have content related to HYIP sites.</li>
      <li><strong>Proxy</strong> – Any proxy set-ups or connections or any sort of activity through remote proxy connections on our hosting and/or in relation to our Colocation services.</li>
      <li><strong>IRC Hosts</strong> – (Hosting an IRC server that is part of or connected to another IRC network or server) Servers, found to be (a) connecting to or (b) part of these networks;</li>
      <li><strong>Defamatory content</strong> – any website content that makes a false claim, expressively stated or implied to be factual, or that may give an individual, business, product, services, group, government or nation a negative image.</li>
      <li><strong>Bit Torrents</strong> – Use of software and scripts for "bit torrents" including sending or receiving files using these mechanisms.</li>
    </ol>
  </li>
  
  <li><strong>Adult Content</strong><br>
  CLOUD 4 INDIA does not allow pornographic or sexually-explicit images or any pictures/ video which are obtained illegally to be hosted on its servers.</li>
  
  <li><strong>Undertaking of the Customer</strong><br>
  The Customer agrees and undertakes that;
    <ol type="a">
      <li>Any attempt to undermine or cause harm to any of the servers of CLOUD 4 INDIA is strictly prohibited. CLOUD 4 INDIA shall take no responsibility for the use of its clients' accounts by the Customer.</li>
      <li>In case of abuse of the resources provided by CLOUD 4 INDIA., in any way, CLOUD 4 INDIA reserves the unqualified right to immediately deactivate the Customer's account, without refund.</li>
      <li>Denial of Service (DOS) attacks directed at CLOUD 4 INDIA., or any attempt to launch a DOS attack from CLOUD 4 INDIA servers are strictly prohibited. All infractions and or suspected infractions will be vigorously investigated and may result in immediate termination of Customer's account.</li>
      <li>In case the Customer is, in any way, disrespectful towards any member of CLOUD 4 INDIA or its staff, CLOUD 4 INDIA shall have full right to terminate Customer's account with it, without any refund.</li>
      <li>CLOUD 4 INDIA. will use reasonable efforts to protect and backup data for its clients / Customer on a regular basis, however, CLOUD 4 INDIA does not guarantee the existence, accuracy, or regular maintenance thereof.</li>
      <li>Use or distribution of tools designed for compromising security is prohibited. Such tools shall include but are not limited to password guessing programs, cracking tools or network probing tools.</li>
      <li>It shall not attempt to interfere with services provided to any user, host or network or carry out DOS attacks which includes but is not limited to "flooding" of networks, deliberate attempts to overload a service, and attempts to "crash" a host.</li>
      <li>Users who violate systems or network security may incur criminal or civil liability. CLOUD 4 INDIA will cooperate fully with investigations of violations of systems or network security at other sites, including cooperating with law enforcement authorities in the investigation of suspected criminal violations.</li>
      <li>It shall complete its own tests for computer viruses in accordance with best computing practice prior to each and every operational use of the Services</li>
    </ol>
  </li>
  
  <li><strong>Materials and Products</strong>
    <ol type="a">
      <li>CLOUD 4 INDIA. shall exercise no control whatsoever over the content of the information passing through the network or on the Customer's websites.</li>
      <li>Use of any information obtained by way of CLOUD 4 INDIA is at the Customer's own risk, and CLOUD 4 INDIA specifically denies any responsibility for the accuracy or quality of information obtained through its services.</li>
      <li>Connection speed represents the speed of connection to CLOUD 4 INDIA and does not represent guarantees of available end to end bandwidth. CLOUD 4 INDIA can only guarantee within its controlled network, availability of bandwidth to Customer's subscribed Committed Information Rate".</li>
    </ol>
  </li>
  
  <li>CLOUD 4 INDIA is under no obligation to edit, review or modify the contents of the Customer's website. However, CLOUD 4 INDIA reserves the right to remove any content on the Customer's website without notice. For the avoidance of doubt, CLOUD 4 INDIA shall not pro-actively monitor messages that are posted on the sites managed by CLOUD 4 INDIA, but it reserves the right to remove such messages at its sole discretion, without notice to the Customer.</li>
  
  <li>The Account of the Customer found to be using the Services for any of the purposes contained in Clause (IV) (i), above shall be terminated without any notice.</li>
  
  <li>The first offense committed by the Customer in respect of Proxy as set out in Clause IV (iv), above will result in immediate suspension of their account. A second violation by the Customer in this regard will result in immediate termination of its account.</li>
  
  <li>Servers found to be (a) connecting to, or (b) part of another IRC network or server will be immediately removed from CLOUD 4 INDIA network, without notice. Such servers will not be reconnected to the network until such time that all traces of the IRC server are completely removed, and the Customer allows access to its server to confirm that the content has been completely removed.</li>
  
  <li><strong>Indemnity</strong><br>
  The Customer agrees that it shall fully and effectively defend, indemnify, save and hold
    <ol type="a">
      <li>CLOUD 4 INDIA harmless from any and all demands, liabilities, losses, costs, actions, proceedings, expenses (including legal expenses), liabilities and/or claims, howsoever suffered or incurred directly or indirectly by CLOUD 4 INDIA, its agents, officers and employees, that may arise or result from any acts or omissions of the Customer, its agents, employees or assigns (a) in connection with their use of the Services, and/or (b) as a consequence of the Customers breach or non- observance of its obligations set out in this AUP.</li>
      <li>The Customer shall defend and pay all costs, damages, awards, fees (including legal expenses) and judgments awarded against CLOUD 4 INDIA arising from breach or breaches of its obligations set out in this AUP. CLOUD 4 INDIA may in its absolute discretion defend such claims and may compromise such claims without the consent of the Customer. The Customer shall provide CLOUD 4 INDIA with the assistance necessary, or as required by CLOUD 4 INDIA, to defend such claims, at the Customer's sole expense.</li>
    </ol>
  </li>
  
  <li><strong>Amendment</strong><br>
  Any amendment or modification of this AUP shall be effective only if it is in writing and duly signed by both the Parties.</li>
</ol>`;

      // Terms & Conditions default content
      const termsContent = `<h1>Terms & Conditions</h1>

<p>Cloud 4 India India Private Limited ("Cloud 4 India", "we", "us") provides cloud platform and configuration services, including but not limited to smart dedicated servers, object storage, content delivery network service and continuous data protection backup services ("Services"). Except as otherwise indicated, customers using the Services shall be referred to as "you" or "your".</p>

<p>We provide these Services, subject to the terms of this document ("Terms"). Your use of the Services or your registration with us constitutes your agreement to these Terms. If you purchase our Services through a separate written agreement/master services agreement, these Terms shall be deemed to be incorporated into that agreement, whether it is specifically called out or not. When you access or use our Website and/or the Services, these Terms shall apply and shall be legally binding on you and to your access and use of the same even if not accepted by you separately.</p>

<p>These Terms constitute a binding legal contract required to use our Infrastructure, website and Services. As such, you may only use our Infrastructure, website and Services if you agree to be bound by these Terms. We may modify these Terms at any time by posting a revised version of the same at www.cloud4india.com, on our website ("Website"), and the amended version of these Terms shall become automatically binding on you if you continue to avail of the Services. The amended terms will be applicable even if not accepted by you separately. If you do not wish to be bound by the updated Terms, we request you to stop accessing the Website and the Services and to reach out to us to deactivate your Customer Account. You shall have the responsibility to review these Terms on a regular basis.</p>

<h2>1. DEFINITIONS</h2>

<p>In these Terms, except where the context otherwise requires, the following words and expressions shall have the following meanings:</p>

<p><strong>1.1 "Affiliates"</strong> means, in relation to any Person, any entity which Controls or is directly or indirectly Controlled by, or under common Control with, such Person.</p>

<p><strong>1.2 "Applicable Law(s)"</strong> shall mean and include any (i) rule of law, statute, bye-law, ruling or regulation having the force of law; or (ii) any code of practice, rules, consent, license, requirement, permit or order having the force of law or pursuant to which a Person is subject to a legally enforceable obligation or requirement; or (iii) any notification, circular or guidelines issued by a regulatory authority; and / or (iv) any determination by or interpretation of any of the foregoing by any judicial authority, whether in effect as of the date of these Terms or thereafter and in each case as may be amended; (v) all the regulations, notification, circulars, guidelines, directives and all other statutory requirements issued by the statutory or Government Authority as may be applicable.</p>

<p><strong>1.3 "Charges"</strong> shall mean, unless the Services are being availed by you through free trial facility, the amount payable by you for the Services either through self-service portal available to you via your Customer Account accessible at the link https://www.cloud4india.com or provisioned manually by our provisioning team for you and shall be computed on the basis of time-based rate (e.g. per hour or per month etc.) or usage-based rate (e.g. per GB per month applied on peak usage of the calendar month) as may be applicable for the particular service.</p>

<p>Further, in case Minimum Billing Amount is applicable for a particular service, the Charges payable by you shall be subject to the applicable Minimum Billing Amount for each calendar month such service is used.</p>

<p><strong>1.4 "Claims"</strong> shall mean all actions, suits, proceedings or arbitrations pending or threatened, at law, in equity or before any Government Authority (as defined below) or competent tribunal or court.</p>

<p><strong>1.5 "Confidential Information"</strong> means and includes the Intellectual Property and any and all business, our technical and financial information or of any of our affiliates that is related to any of the arrangements contemplated in these Terms or any other agreement in which these Terms is incorporated by reference or otherwise disclosed by us to you. It shall include any information which relates to our financial and/or business operations, including but not limited to, specifications, models, merchant lists/information samples, reports, forecasts, current or historical data, computer programs or documentation and all other technical, financial or business data, information related to its internal management, customers, products, services, anticipated products/services, processes, financial condition, employees, merchants, marketing strategies, experimental work, trade secrets, business plans, business proposals, customer contract terms and conditions, compensation/commission/ service and other valuable confidential information and materials that are customarily treated as confidential or proprietary, whether or not specifically identified as confidential or proprietary.</p>

<p><strong>1.6 "Controlling", "Controlled by" or "Control"</strong> with respect to any Person, shall mean: (a) the possession, directly or indirectly, of the power to direct or cause the direction of the management and policies of such Person whether through the ownership of voting share, by agreement or otherwise, or the power to elect more than half of the directors, partners or other individuals exercising similar authority with respect to such Person and (b) the possession, directly or indirectly, of a voting interest of more than 50% (Fifty Percent).</p>

<p><strong>1.7 "Customer Data"</strong> means all data, including all text, sound, software, image or video files, and all derivatives of such data that are created by or originated with you or your End Users. You and/or your End Users retain ownership of all and any such Customer Data. The right granted to us to access and use such Customer Data is limited to the sole purpose of providing the Services or for compliance of legal obligations and shall not be understood as granting us any ownership rights thereto or any right to use or transfer, except as specifically provided herein.</p>

<p><strong>1.8 "De-provisioning of Services"</strong> in relation to the Services, shall mean termination of the Services being provided to you, release and reallocation of all resources allocated to the Customer and deletion of Customer Data stored on our servers.</p>

<p><strong>1.9 "End User"</strong> means any individual or entity that directly or indirectly through another user accesses or uses the Services under the Customer Account. The term "End User" does not include individuals or entities when they are accessing or using the Services or any Cloud 4 India services under their own Cloud 4 India account, rather than under the Customer Account.</p>

<p><strong>1.10 "Force Majeure Event"</strong> includes but is not limited to significant failure of a part of the power grid, significant failure of the internet, systemic electrical, telecommunications or other utility failures, natural disaster, war, riot, insurrection, embargoes, epidemic, outbreak of infectious disease(s) which has an impact of frustrating the performance of the affected party's obligations under these Terms, pandemic, fire, strikes or other organised labour action, terrorist activity, acts of Government Authority, acts of God, or other events of a magnitude or type for which precautions are not generally taken in the industry and acts/reasons which are beyond the control of any party or any other cause which cannot be predicted by men of ordinary prudence.</p>

<p><strong>1.11 "Government Authority(ies)"</strong> shall mean: (a) a government, whether foreign, federal, state, territorial or local which has jurisdiction over Cloud 4 India; (b) a department, office or minister of a government acting in that capacity; or (c) a commission, agency, board or other governmental, semi-governmental, judicial, quasi-judicial, administrative, monetary or fiscal authority, body or tribunal.</p>

<p><strong>1.12 "Infra Credit Prepaid Customer"</strong> shall mean a customer who gets infra credits which can be used for availing various services being provided by us.</p>

<p><strong>1.13 "Inherent Business Risk"</strong> means those risks that are in the ordinary course associated with the provision of cloud services, including but not limited to loss of data due to attack on our servers by Malware, malfunction of our servers and other equipment under our control, malfunction of our software or supporting Third-Party Software.</p>

<p><strong>1.14 "Inactive Customer"</strong> shall mean a customer who, at any point of time, has not consumed or utilised any of the Services in the preceding 90 (Ninety) days.</p>

<p><strong>1.15 "Intellectual Property" or "IP"</strong> includes patents, trademarks, service marks, trade names, registered designs, copyrights, rights of privacy and publicity and other forms of intellectual or industrial property, know-how, inventions, formulae, confidential or secret processes, trade secrets, any other protected rights or assets and any licences and permissions in connection therewith, in each and any part of the world and whether or not registered or registrable and for the full period thereof, and all extensions and renewals thereof, and all applications for registration in connection with the foregoing and "Intellectual Property Rights" or "IPR" shall mean all rights in respect of the Intellectual Property.</p>

<p><strong>1.16 "Losses"</strong> shall mean any loss, damage, injury, liabilities, settlement, judgment, award, fine, penalty, fee (including reasonable attorneys' fees), charge, cost or expense of any nature incurred in relation to a Claim(s).</p>

<p><strong>1.17 "Malware"</strong> shall mean any malicious computer code such as viruses, logic bombs, worms, trojan horses or any other code or instructions infecting or affecting any program, software, client data, files, databases, computers or other equipment or item, and damaging, undermining or compromising integrity or confidentiality, incapacitating in full or in part, diverting or helping divert in full or in part an information system from its intended use.</p>

<p><strong>1.18 "Managed Services"</strong> shall mean the provision of professional services for additional payment to a customer by us to enable management of cloud computing infrastructure. Unless specifically stated, the Services provided to you shall be deemed to be "Self- Managed Services" and not "Managed Services".</p>

<p><strong>1.19 "Material Adverse Effect"</strong> shall mean any state of facts, change, development, effect, condition or occurrence that adversely affects either party's ability to perform its obligations under these Terms.</p>

<p><strong>1.20 "Person"</strong> shall mean any natural person, limited or unlimited liability company, corporation, general partnership, limited partnership, proprietorship, trust, association, or other entity, enterprise, or business organisation, incorporated under Applicable Law or unincorporated thereunder, registered under Applicable Law or unregistered thereunder.</p>

<p><strong>1.21 "Minimum Billing Amount"</strong> shall mean the minimum amount of usage charges pertaining to a particular service provided by us for a calendar month regardless of the actual time- based usage of such service during such calendar month.</p>

<p><strong>1.22 "Refund Policy"</strong> means the Refund Policy published on the Website accessible at https://www.cloud4india.com as may be amended by us from time to time. The most current version would always be published on the Website.</p>

<p><strong>1.23 "Privacy Policy"</strong> means the Privacy Policy published on the Website accessible at https://www.cloud4india.com, as may be amended by us from time to time. The most current version would always be published on the Website.</p>

<p><strong>1.24 "Service Level Agreement" or "SLA"</strong> means the Service Level agreement published on the Website and accessible at https://www.cloud4india.com, which sets out the service levels that we offer with respect to our Services. This may be amended from time to time at our sole discretion and the most current version would always be published on the Website.</p>

<p><strong>1.25 "TDS"</strong> shall mean tax deducted at source in accordance with Applicable Law.</p>

<p><strong>1.26 "Term".</strong> These Terms shall be binding on you from the date on which you begin to avail the Services from us and shall remain valid till you continue to avail the Services.</p>

<p><strong>1.27 "Third Party"</strong> shall mean a Person except you and us.</p>

<p><strong>1.28 "Variable Usage Charges"</strong> shall mean the Charges that may vary depending on the usage of any Cloud 4 India service by you and which may increase over a period of time due to increase in use without any explicit action being taken by you to avail such additional usage.</p>

<p>For instance, the Variable Usage Charges with respect to the backup services being availed by you shall increase over a period of time based on your backup frequency, the increase in data being backed up on the servers and the peak storage usage in a calendar month.</p>

<h2>2. USE OF THE SERVICES</h2>

<p><strong>2.1</strong> By availing the Services, you are required to comply with these Terms and all other operating rules, policies and procedures that may be published from time to time on the Website, including the Acceptable Use Policy and Privacy Policy.</p>

<h2>3. WARRANTIES AND REPRESENTATIONS</h2>

<p><strong>3.1</strong> We hereby represent and warrant to you as follows:</p>
<ul>
  <li>We are duly organised and validly exist under the Applicable Laws and have all requisite legal power and authority to provide the Services to you;</li>
  <li>We are not insolvent and no insolvency proceedings have been instituted, nor threatened or pending by or against us before any court of competent jurisdiction;</li>
</ul>

<p><strong>3.2</strong> You hereby represent and warrant to us as follows:</p>
<ul>
  <li>You are duly organised and validly exist under the Applicable Laws and have all requisite legal power and authority to be bound by these Terms. In the event that you are registering for the Services on behalf of an incorporated entity, you represent and warrant that you and the entity are bound by these terms and you are legally authorized to act on behalf of such incorporated entity;</li>
  <li>You are not insolvent and no insolvency proceedings have been instituted, nor threatened or pending by or against you;</li>
  <li>You have complied with Applicable Law in all material respects and have not been subject to any fines, penalties, injunctive relief or any other civil or criminal liabilities, which in the aggregate has or may have a direct Material Adverse Effect;</li>
  <li>There are no actions, suits, Claims, proceedings or investigations pending or, to the best of your knowledge, threatened in writing against you at law, in equity, or otherwise, whether civil or criminal in nature, before or by, any court, commission, arbitrator or Government Authority, and there are no outstanding judgments, decrees or orders of any such courts, commissions, arbitrators or Government Authorities, which materially and adversely effects your ability to perform your obligations under these Terms;</li>
  <li>All information disclosed by you in relation to the Services has been reasonably identified and truthfully disclosed to us to the best of your knowledge and there is no misrepresentation in the information being shared with us. You acknowledge that any misrepresentation of information can adversely affect the quality of the Services to be rendered to you;</li>
  <li>Our Website and Services are not targeted towards, nor intended for use by anyone under the age of 18 years. By using our Website and Services, you represent and warrant to us that you are 18 years of age or older.</li>
  <li>You have had adequate opportunity to read and understand these Terms and agree to be legally bound by them.</li>
</ul>

<p><strong>3.3</strong> In no event does the above warranty will apply to:</p>
<ul>
  <li>any failure or nonconformance of the Services with specifications (as provided in the Agreement or otherwise) caused by or attributable to any associated or complementary products not supplied under the Agreement,</li>
  <li>the quantity or quality of the products of Customer or the process of manufacture for/on which the Services or products are used,</li>
  <li>damage, fault, failure or malfunction due to Force Majeure or normal wear and tear,</li>
  <li>any attempt by any person other than Cloud 4 India's personnel or any person authorized by Cloud 4 India, to perform all or part of the Services and</li>
  <li>Third Party Materials. The warranty and remedies are conditioned upon (i) conformance with any applicable recommendations of Cloud 4 India, and (ii) Customer promptly notifying Cloud 4 India of any defects in Services. The Customer acknowledges that there are risks inherent in internet connectivity outside Cloud 4 India's sphere of influence that may result in the loss of Customer's privacy, confidential information, and property. Customer acknowledges that Cloud 4 India does not control the transfer of data over communications facilities, including the internet, and that the Services may be subject to limitations, delays, and other problems inherent in the use of such communications facilities. Cloud 4 India shall not responsible for any delays, delivery failures, or other damage resulting from such problems. Cloud 4 India shall not be responsible for any issues related to the performance, operation or security of the Services that arise from Customer's content, applications or Third-Party Materials.</li>
</ul>

<p><strong>3.4</strong> The Customer acknowledges and understands that Cloud 4 India is not privy to any data and/or information of the Customer ("Customer Data") because of the nature of provision of Services and it acts solely for hosting of the Customer Data. Cloud 4 India shall not be liable for any loss of Customer Data while availing the Services from Cloud 4 India unless Customer has opted and availed in the Services for data backup along with data assurance services. Under no circumstances will Cloud 4 India have any liability or responsibility for (i) the loss of Customer Data or other information unless caused by the gross negligence or willful misconduct of Cloud 4 India; and (ii) security breaches, viruses, hacked servers, worms, or corrupted data including Customer Data, unless caused by the gross negligence or willful misconduct of Cloud 4 India.</p>

<p><strong>3.5</strong> The foregoing sets forth the exclusive remedies of Customer and the sole liability of Cloud 4 India for claims based on failure of, or defect in, Services, whether such claim is based on contract, law, indemnity, warranty, tort (including negligence), strict liability or otherwise. THE FOREGOING WARRANTIES ARE EXCLUSIVE AND IN LIEU OF ALL OTHER WARRANTIES, WHETHER WRITTEN, ORAL, IMPLIED (BY STATUTE, COMMON LAW, TRADE USAGE, COURSE OF DEALING OR OTHERWISE) OR STATUTORY, INCLUDING ANY WARRANTY OF MERCHANTABILITY OR FITNESS FOR PARTICULAR PURPOSE. Cloud 4 India does not provide any representations or warranties other than those set out in Clause 3 above.</p>

<p><strong>3.6</strong> Cloud 4 India does not provide any representation or warranty in respect of any products or services provided by others. Cloud 4 India shall have no obligation for loss, liability or damage which results because (a) Customer fails to utilize, operate or maintain the Services or any materials or equipment in connection with the Services in accordance with (i) applicable law and generally approved industry practices or (ii) the provisions of this Agreement or (iii) the provisions of any storage, operating or maintenance instructions furnished to Customer or (iv) data loss or business loss due to disaster or cyber-attacks (force majeure clause applies) (b) Customer breaches applicable law. Customer agrees to indemnify Cloud 4 India against any loss, liability, harm or damage that Cloud 4 India may suffer as a result of Customer's failure or breach as described in this clause.</p>

<h2>4. YOUR OBLIGATIONS</h2>

<p><strong>4.1 Customer Account</strong></p>
<ul>
  <li>You are responsible for monitoring the activities under your Cloud 4 India account ("Customer Account"), regardless of whether the activities are authorised or undertaken by you or your employees or by a Third Party (including but not limited to your contractors, agents or any End Users). We shall not be held or deemed responsible for any unauthorized access to the Customer Account.</li>
  <li>You should ensure the setting of strong passwords and access control mechanisms and other data protection control measures prescribed under Applicable law in order to protect Customer Data and prevent unauthorised access to the Customer Account.</li>
  <li>You should immediately notify us of any unauthorized use of the Customer Account or any other breach of security and cooperate with our investigation of service outages, security issues or any suspected breach of these Terms.</li>
  <li>We shall not be held responsible for any security breach resulting due to your failure to implement and/or comply with security measures or due to any other cause, which in our opinion is beyond our control. All and any liability(ies) arising out of or in connection with such security breach shall be solely and totally borne by you, and neither you, nor your representatives having gained access to your Customer Account or any Third Party gaining unauthorized access to your Customer Account shall have any Claims against us for such liabilities.</li>
  <li>You shall defend, indemnify and hold harmless, us, our Affiliates, or any of our respective employees, agents or suppliers ("Indemnified Parties"), from and against any and all Claims and/or Losses arising out of or attributable, whether directly or not, to such security breach.</li>
</ul>

<p><strong>4.2 Backup of Customer data:</strong> You should take appropriate action to secure, protect and backup the Customer Data including programs, data, software and any other Customer Data. We shall not be under any obligation, while providing the Services to the Customer, under these Terms, to maintain any copy or back up Customer Data.</p>

<p>Notwithstanding that you are availing backup services from us, you shall remain responsible to ensure that adequate back-up is taken by you and to test the accuracy of such back up of Customer Data. We shall not be responsible for the same. Further, you shall be liable to pay us, without dispute, any Minimum Billing Amounts and/or Variable Usage Charges that accrue due to the use of such backup services.</p>

<p><strong>4.3 Use of Licensed Software</strong></p>
<ul>
  <li>You hereby acknowledge that the software provided with the Services, is provided by Third Party(s) ("Third Party Software"). All Third Party Software is being licensed to you subject to terms and conditions of an End-User License Agreement (EULA) and you hereby agree to abide by the terms and conditions of the EULA associated with the Third Party Software.</li>
  <li>You shall, at all times during the Term, be under the obligation to use the licensed version of the software to be used by you in relation to the Services. You shall not use any pirated software in availing the Services. Further, you shall be solely liable for any Losses or Claims arising out of your use (or use by the End Users) of any unmaintained open source software or any obsolete Third Party Software to run your workloads while using the Services and you shall accordingly indemnify, defend and hold harmless the Indemnified Parties.</li>
  <li>If any Claims are made against the Indemnified Parties in relation to use of such Third Party Software by you, your representatives or End Users, without complying with the terms and conditions of the applicable EULA or due to such use of a license beyond the agreed upon or paid-for level, then you shall be liable for such Claims and any Losses arising out of the same, and shall hold harmless the Indemnified Parties.</li>
  <li>We shall not be responsible for any Third Party Software, neither shall we be responsible for damage caused by such Third Party Software. Further, we may, in our sole discretion, at your request and on paid basis, configure the Third Party Software with your equipment, and the configuration of such software shall be done as per the instructions of the respective Third Party. Provided however that, this shall not be construed as imposing any obligation upon us to provide such services. We shall not be liable for any damages, whether such damages are direct, indirect or consequential, arising due to configuration of the Third Party Software with your equipment.</li>
  <li>You shall be responsible to update any Third Party Software provided with the Services, as and when you receive notification from the Third Party Software provider. We shall not be responsible to ensure such update and we shall not be liable for any disruption in the Services on account of unforeseen software conflict or bug issues due to your failure to update the Third Party Software.</li>
  <li>You shall not remove or tamper with the copyright, trademark or patent notices contained in the Third Party Software.</li>
</ul>

<p><strong>4.4</strong> You shall document and promptly report all errors or malfunctions noticed by you to Cloud 4 India. If you provide any feedback in relation to the Services, we shall be entitled to use such feedback to improve our Services, without incurring any obligations towards you.</p>

<p><strong>4.5</strong> You shall ensure that all legal compliances as per Applicable Laws/ applicable regulatory framework as may be required for you to access the Services, are fulfilled by you. You shall be responsible for the security of the Services (including the equipment used to access these Services) being availed by you and at no point of time, shall we be held responsible if the security of the Services or the related equipment employed by you is breached. You shall be responsible to take reasonable measures, including but not limited to encryption of data, for ensuring protection of data stored/uploaded by you through the Services.</p>

<p><strong>4.6</strong> In order to facilitate the provision of the Services, you shall provide us with the required assistance, as reasonably requested by us from time to time.</p>

<p><strong>4.7</strong> You should ensure the availability and stability of the computing environment to support the Services, if and to the extent required in connection with the delivery of the Services.</p>

<p><strong>4.8</strong> Neither you, nor your representatives and/or End Users, shall remove or tamper with the copyright, trademark or patent notices contained in any content provided by us in the course of providing the Services, or in the software provided by us (which shall not include Third Party Software). You shall defend, indemnify and hold harmless the Indemnified Parties from and against any and all Claims arising out of or attributable, whether directly or not, to the violation of this Clause 4.8 by you, your representative and/or the End Users.</p>

<p><strong>4.9</strong> You shall observe proper ethics and transparency in all your actions in the course of discharging your obligations under these Terms and you shall not, in any circumstances, take any action or make any statement that may mislead any other existing Cloud 4 India customer or prospective Cloud 4 India customer regarding the Services or Cloud 4 India itself, or impact Cloud 4 India's business or goodwill adversely.</p>

<p><strong>4.10</strong> You shall comply with all your obligations pursuant to these Terms and ensure that all payments due to us are paid in a timely manner in accordance with the due dates mentioned in the invoices/reminder emails sent by us.</p>

<p><strong>4.11</strong> You are responsible for monitoring your usage of the Services and shall be liable for all Charges incurred under your Customer Account, regardless of whether you authorized such usage.</p>

<h2>7. TERMINATION</h2>

<h2>5. CHARGES</h2>

<p><strong>5.1</strong> Customer shall pay Cloud 4 India all fees/charges including monthly/quarterly/annual, as the case may be data transfer fees and excess usage fees, if any indicated on sales order ("Order") attached to as Annexure – II to this agreement. Customer acknowledges that in consideration of the discounted pricing set forth in the Order, if any, Customer commits to be liable for and pay the monthly fees set forth in an order for the term indicated in such order. (Including excess usage fees)</p>

<p><strong>5.2</strong> Customer shall be liable in case it utilizes bandwidth/data transfer in excess of what he has agreed for and shall reimburse Cloud 4 India for such excess usage per GB (as per the excess usage charges indicated in the proposal). Bandwidth/data transfer usage shall only be monitored through MRTG (a bandwidth monitoring software, info of which is available on www.mrtg.com) using Simple Network Management Protocol (SNMP) to measure data transferred. The reports obtained from MRTG will be final and binding on Customer. Cloud 4 India at its own discretion reserves the right to change the Bandwidth/data transfer usage-monitoring software an intimation of which shall be given to the Customer. Moreover, Cloud 4 India shall not be responsible for any excess/normal usage if the traffic generated is due to some malfunction of hardware, software or due to configurations done by the customer. The customer also agrees that it will be paying for the excess usages generated by any virus/Trojans, etc.</p>

<p><strong>5.3</strong> All payments shall be made by Cheque or Demand Draft drawn in favor of "Cloud 4 India" payable at Bengaluru, and it is to be sent to the address indicated in this Agreement or at such other address as Cloud 4 India may from time to time indicate by proper notice to customer. No Outstation Cheques shall be accepted. Customer shall pay payments in advance for the service period. Cloud 4 India shall raise invoice at least 15 days before the start of the period and send the same to the customer. All invoices shall be due and payable within fifteen (15) days of Cloud 4 India's date of invoice. Customer shall be liable to pay interest at the rate of one and half percent (2%) per month on all overdue and unpaid invoices.</p>

<p><strong>5.4</strong> Customer shall pay, indemnify and hold Cloud 4 India harmless from all sales, service, value-added or other taxes of any nature, other than taxes on Cloud 4 India's net income, including penalties and interest, and all government permit or license fees assessed upon or with respect to any fees (except to the extent Customer provides Cloud 4 India with a valid tax exemption certificate). If any applicable statutory provision of law requires Customer to withhold amounts from any payments to Cloud 4 India hereunder, then Customer shall affect such withholding, remit such amount to the appropriate taxing authorities and promptly furnish Cloud 4 India with tax receipts evidencing the payments of such amounts.</p>

<h2>6. TERM</h2>

<p><strong>6.1</strong> The terms of this Agreement shall commence on the date of its execution by the Customer and shall be reviewed on an annual basis within the terms of this Agreement, and provided further, that with regard to any orders then outstanding, this Agreement shall continue to govern such Orders until such orders have been fully performed or terminated. The Agreement shall be deemed to be automatically renewed at the then current fees for additional periods, unless either party gives written notice otherwise to the other party, not less than thirty (30) days prior to the expiration of such order. This Agreement may be renewed for Additional Terms upon the mutual written consent of both parties.</p>

<h2>7. TERMINATION</h2>

<p><strong>7.1</strong> Either party may terminate this Agreement or any order upon written notice: (a) for any material breach of this Agreement or any Order which the defaulting party fails to cure within fifteen (15) days following written notice by the non-defaulting party of such breach; or (b) upon either party's insolvency or liquidation as a result of which either party ceases to do business. Notwithstanding anything herein to the contrary, Cloud 4 India may terminate this Agreement or any Order without notice immediately for any breach under this Agreement.</p>

<p><strong>7.2</strong> Customer shall comply with all applicable procedures of Cloud 4 India related to equipment removal upon termination. In the event of any expiration or earlier termination of this Agreement or any Order, Customer will be obligated to pay to Cloud 4 India full contract period fees and charges unless such termination is the result of Cloud 4 India's default, the payment of any waived or discounted installation fees, as well as monthly fees for each remaining month of the term of the affected Order(s).</p>

<p><strong>7.3</strong> In addition, if Customer fails to pay any invoice(s) for fifteen (15) days or more from the date of such invoice, Customer Cloud 4 India shall deny access to the Space and the equipment of the customer placed with the Cloud 4 India shall not be released until such time till the invoice(s) has been paid in full.</p>

<p><strong>7.4</strong> If the default continues for further 15 days, then Cloud 4 India shall be entitled to retain and sell the equipment of the customer placed with Cloud 4 India and in case of any loss in selling the equipment, same shall be borne by the customer. Cloud 4 India shall not be responsible if any loss incurs in the selling of the equipment and in case the equipment is sold for an amount higher than what is to be recovered, such excess amount shall be paid back to the customer.</p>

<h2>8. CUSTOMER EQUIPMENT</h2>

<p><strong>8.1</strong> Customer shall be responsible for all equipment placed at Cloud 4 India's facility. Customer shall ensure that all equipment complies with applicable safety and technical standards.</p>

<p><strong>8.2</strong> Cloud 4 India shall not be responsible for any damage to Customer's equipment except to the extent caused by Cloud 4 India's gross negligence or willful misconduct.</p>

<h2>9. SCHEDULED MAINTENANCE</h2>

<p><strong>9.1</strong> Cloud 4 India may perform scheduled maintenance on the Services with prior notice to Customer. Scheduled maintenance will be performed during maintenance windows as agreed with Customer.</p>

<p><strong>9.2</strong> Cloud 4 India will use reasonable efforts to minimize the impact of scheduled maintenance on Customer's use of the Services.</p>

<h2>10. SUPPORT</h2>

<p><strong>10.1</strong> Cloud 4 India will provide support for the Services in accordance with the Service Level Agreement. Support will be provided during business hours unless otherwise agreed.</p>

<p><strong>10.2</strong> Customer may contact Cloud 4 India's support desk for assistance with the Services. Support contact information will be provided to Customer upon commencement of Services.</p>

<h2>11. USE OF MATERIAL</h2>

<p><strong>11.1</strong> Customer shall not use the Services to transmit, distribute, or store any material that violates any Applicable Law or infringes any intellectual property rights.</p>

<p><strong>11.2</strong> Customer shall be solely responsible for all content and material transmitted, distributed, or stored using the Services.</p>

<h2>12. ONLINE CONDUCT</h2>

<p><strong>12.1</strong> Customer agrees to use the Services in a manner that is lawful and in accordance with these Terms and the Acceptable Use Policy.</p>

<p><strong>12.2</strong> Customer shall not use the Services to engage in any activity that is harmful, illegal, or violates the rights of others.</p>

<h2>13. PROHIBITED ACTIVITIES</h2>

<p><strong>13.1</strong> Customer shall not use the Services for any prohibited activities as set forth in the Acceptable Use Policy, including but not limited to activities that are illegal, harmful, or violate the rights of others.</p>

<p><strong>13.2</strong> Cloud 4 India reserves the right to suspend or terminate Services immediately if Customer engages in any prohibited activities.</p>

<h2>14. THIRD PARTY COMPLAINT PROCESS</h2>

<p><strong>14.1</strong> If Cloud 4 India receives a complaint from a third party regarding Customer's use of the Services, Cloud 4 India will notify Customer and provide Customer with an opportunity to respond.</p>

<p><strong>14.2</strong> Cloud 4 India may take appropriate action, including suspension or termination of Services, if Customer fails to respond to a third party complaint or if the complaint is found to be valid.</p>

<h2>15. ABUSE OF SERVICE</h2>

<p><strong>15.1</strong> Any abuse of the Services, including but not limited to excessive use of resources, violation of the Acceptable Use Policy, or any activity that disrupts or interferes with the Services, may result in immediate suspension or termination of Services.</p>

<p><strong>15.2</strong> Customer shall be liable for all costs and expenses incurred by Cloud 4 India as a result of Customer's abuse of the Services.</p>

<h2>16. SOFTWARE LICENSE</h2>

<p><strong>16.1</strong> Any software provided by Cloud 4 India as part of the Services is licensed to Customer for use solely in connection with the Services and in accordance with the applicable license terms.</p>

<p><strong>16.2</strong> Customer shall not copy, modify, distribute, or create derivative works of any software provided by Cloud 4 India without Cloud 4 India's prior written consent.</p>

<h2>17. CONFIDENTIALITY</h2>

<p><strong>17.1</strong> Each party agrees to maintain the confidentiality of the other party's Confidential Information and not to disclose such Confidential Information to any third party without the prior written consent of the disclosing party, except as required by Applicable Law or as necessary to perform its obligations under these Terms.</p>

<p><strong>17.2</strong> The obligations of confidentiality set forth in this Section 17 shall survive the termination or expiration of these Terms and shall continue for a period of five (5) years thereafter, except with respect to trade secrets, which shall remain confidential indefinitely.</p>

<h2>18. LIMITATION OF LIABILITY</h2>

<p><strong>18.1</strong> TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL CLOUD 4 INDIA, ITS AFFILIATES, OR THEIR RESPECTIVE DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, LOSS OF DATA, LOSS OF BUSINESS OPPORTUNITY, OR OTHER ECONOMIC LOSS, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR THE SERVICES, REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE) AND EVEN IF CLOUD 4 INDIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>

<p><strong>18.2</strong> TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CLOUD 4 INDIA's TOTAL LIABILITY FOR ALL CLAIMS ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE TOTAL AMOUNT PAID BY YOU TO CLOUD 4 INDIA FOR THE SERVICES IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE DATE ON WHICH THE CLAIM AROSE.</p>

<p><strong>18.3</strong> The limitations of liability set forth in this Section 18 shall not apply to (a) your payment obligations, (b) either party's indemnification obligations, (c) damages resulting from gross negligence or willful misconduct, or (d) any liability that cannot be excluded or limited under Applicable Law.</p>

<h2>19. DATA PROTECTION</h2>

<p><strong>19.1</strong> Cloud 4 India will implement reasonable security measures to protect Customer Data. However, Customer acknowledges that no security system is completely secure and Cloud 4 India cannot guarantee absolute security of Customer Data.</p>

<p><strong>19.2</strong> Customer is responsible for maintaining backups of Customer Data. Cloud 4 India shall not be liable for any loss of Customer Data except to the extent caused by Cloud 4 India's gross negligence or willful misconduct.</p>

<h2>20. INTELLECTUAL PROPERTY</h2>

<p><strong>20.1</strong> All intellectual property rights in the Services, including but not limited to software, documentation, and other materials provided by Cloud 4 India, remain the property of Cloud 4 India or its licensors.</p>

<p><strong>20.2</strong> Customer retains all intellectual property rights in Customer Data. Customer grants Cloud 4 India a license to use Customer Data solely for the purpose of providing the Services.</p>

<h2>21. FORCE MAJEURE</h2>

<p><strong>21.1</strong> Neither party shall be liable for any failure or delay in performance under these Terms due to a Force Majeure Event. If a Force Majeure Event occurs, the affected party shall notify the other party as soon as reasonably practicable.</p>

<p><strong>21.2</strong> If a Force Majeure Event continues for more than thirty (30) days, either party may terminate these Terms upon written notice to the other party.</p>

<h2>22. NOTICES</h2>

<p><strong>22.1</strong> All notices required or permitted under these Terms shall be in writing and delivered to the addresses specified in the Agreement or as otherwise notified by the parties.</p>

<p><strong>22.2</strong> Notices may be delivered by email, registered mail, or courier service. Notices shall be deemed received upon delivery if delivered by hand, three (3) business days after mailing if sent by registered mail, or upon confirmation of delivery if sent by courier.</p>

<h2>23. ASSIGNMENT</h2>

<p><strong>23.1</strong> Customer may not assign, transfer, or delegate any of its rights or obligations under these Terms without Cloud 4 India's prior written consent.</p>

<p><strong>23.2</strong> Cloud 4 India may assign, transfer, or delegate its rights or obligations under these Terms to any affiliate or in connection with a merger, acquisition, or sale of all or substantially all of its assets.</p>

<h2>24. SEVERABILITY</h2>

<p><strong>24.1</strong> If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall remain in full force and effect.</p>

<p><strong>24.2</strong> The invalid, illegal, or unenforceable provision shall be replaced with a valid, legal, and enforceable provision that most closely approximates the intent of the original provision.</p>

<h2>25. INDEMNIFICATION</h2>

<p><strong>25.1</strong> You agree to defend, indemnify, and hold harmless Cloud 4 India, its Affiliates, and their respective directors, officers, employees, agents, contractors, directors, suppliers and representatives from all liabilities, losses, claims, and expenses, including reasonable attorneys' fees, that arise from or relate to (i) Your use or misuse of, or access to, the Services, Software and Platform; or (ii) Your violation of the Terms and Conditions; or any applicable law, contract, policy, regulation or other obligation including that of the Third Party Platforms. We reserve the right to assume the exclusive defense and control of any matter otherwise subject to indemnification by You, in which event You will assist and cooperate with Us in connection therewith.</p>

<p><strong>25.2</strong> Cloud 4 India does not provide any representation or warranty in respect of any products or services provided by others. Cloud 4 India shall have no obligation for loss, liability or damage which results because (a) Customer fails to utilize, operate or maintain the Services or any materials or equipment in connection with the Services in accordance with (i) applicable law and generally approved industry practices or (ii) the provisions of this Agreement or (iii) the provisions of any storage, operating or maintenance instructions furnished to Customer or (iv) data loss or business loss due to disaster or cyber-attacks (force majeure clause applies) (b) Customer breaches applicable law. Customer agrees to indemnify Cloud 4 India against any loss, liability, harm or damage that Cloud 4 India may suffer as a result of Customer's failure or breach as described in this clause.</p>

<h2>26. MISCELLANEOUS</h2>

<p><strong>26.1 Entire Agreement:</strong> These Terms, together with Company Policies and any other documents expressly referred herein, constitute the entire understanding between the parties with respect to the subject matter hereof. In addition, the terms and conditions as set forth in any invoice, or any other official communications in writing between you and us, including payment reminders and suspension emails, shall also be binding on you.</p>

<p><strong>26.2 Force Majeure:</strong> We will not be responsible for the delays or damages that may occur due to any act, omission or delay caused by a Force Majeure Event. We will be entitled to discontinue the Services with immediate effect on the occurrence of a Force Majeure Event, if in our opinion we are unable to continue to provide the Services as per these Terms.</p>

<p><strong>26.3 Email Communication:</strong> You agree that any notices, agreements, disclosures, or other communications that we send to you electronically through email will satisfy any legal communication requirements, including that those communications be in writing. You agree to receive such electronic notices from us, which will be sent by email to the email address then associated with your Customer Account. You are responsible for ensuring that the email address associated with your Account is accurate and current. Any email notice that we send to that email address will be effective when sent, whether or not you actually receive the email.</p>

<p><strong>26.4 Relationship of the Parties:</strong> The parties are independent contractors. These Terms does not create a partnership, franchise, joint venture, agency, fiduciary or employment relationship between the parties. Neither party, nor any of their respective affiliates, is an agent of the other for any purpose or has the authority to bind the other.</p>

<p><strong>26.5 Assignment:</strong> You may not assign, transfer or delegate any of your rights and obligations under these Terms, in whole or in part, by operation of law or otherwise, without our prior written consent. We may assign, transfer or delegate our rights and obligations under these Terms without notice or consent.</p>

<p><strong>26.6 No Waiver:</strong> Neither party will be treated as having waived any rights by not exercising (or delaying the exercise of) any rights under this Agreement.</p>

<p><strong>26.7 Severability:</strong> If any part of these Terms is invalid, illegal, or unenforceable, the rest of the Agreement will remain in effect.</p>

<p><strong>26.8 Non-Solicitation:</strong> You for any reason, shall not, directly or indirectly solicit our employees who are on our panel/rolls to leave their respective employment/business engagements during the period you are using the Services and for 2 (two) years after the termination of Services.</p>

<p><strong>26.9 Governing Law:</strong> These Terms shall be governed and constructed in accordance with the Applicable Laws of India. Subject to the Clause 26.10 below, the courts at New Delhi shall have exclusive jurisdiction over any of the disputes arising out of or in relation to these Terms.</p>

<p><strong>26.10 Dispute Resolution:</strong> In the event of any dispute, claim or controversy arising under, or in relation to these Terms, such dispute shall be resolved by arbitration in accordance with the Arbitration and Conciliation Act, 1996. The dispute shall be settled by a sole arbitrator to be appointed by the parties to the dispute and the seat of arbitration shall be New Delhi, India. The arbitration award shall be final and binding on the Parties and shall be enforceable in any competent court of law.</p>

<h2>27. COMPLIANCE WITH CERT-IN DIRECTIONS</h2>

<p>The customer hereby agree and warrant to comply with the following directions contained in Cert In directions dated April 28, 2022 and produce the relevant records as when asked by the Company pursuant to any verbal or written order of a Government authority:</p>

<p><strong>27.1</strong> customer agree to enable logs of all their ICT systems and maintain them securely for a rolling period of 180 days and the same shall be maintained within the Indian jurisdiction.</p>

<p><strong>27.2</strong> customer agree to maintain the following accurate information which must be maintained by them for a period of 5 years or longer duration as mandated by the law after any cancellation or withdrawal of the registration as the case may be in respect of the end-users of services provided by Cloud 4 India:</p>
<ul>
  <li>Validated names of subscribers/customers hiring the services</li>
  <li>Period of hire including dates</li>
  <li>IPs allotted to / being used by the members</li>
  <li>Email address and IP address and time stamp used at the time of registration / on-boarding</li>
  <li>Purpose for hiring services</li>
  <li>Validated address and contact numbers</li>
  <li>Ownership pattern of the subscribers / customers hiring services</li>
</ul>

<h2>28. OTHER OBLIGATIONS OF CUSTOMERS</h2>

<p><strong>28.1</strong> The customer shall provide the services only to the following type of users:</p>
<ul>
  <li><strong>End Users:</strong> End users shall mean those individuals or entities who are taking services for their own use and shall exclude customers who offer Cloud Infrastructure Services or similar services like WebHosting to their clients.</li>
  <li><strong>Managed Service Providers (MSPs):</strong> The Customer can provide the services to MSPs who are not end users but manage infrastructure for their clients.</li>
</ul>

<p><strong>28.2</strong> Customers are not allowed to provide Cloud 4 India services/Infrastructure to any customer located outside India.</p>

<p><strong>28.3</strong> Customers shall ensure that all its end-users directly or indirectly using Cloud 4 India services are bound by Terms of Service similar to that of Cloud 4 India Terms of Services and that all provisions of Cloud 4 India Terms of Services are complied by all its end-users.</p>

<p><strong>28.4</strong> In case of any seizure of hardware provided by Cloud 4 India to customer by any Government Authority, for the purpose of an investigation against customer, its agents or End Users, or for any other purpose as per the requirement of the Government Authority, the customer shall be liable to pay, without any protest or demur, upfront the amount decided by Cloud 4 India, in its sole discretion, as (i) The cost of storage which is used by Cloud 4 India to provide requested data or information to the Government Authority, and (ii) the cost of server or equipment seized by the Government Authority, and (iii) the cost of effort made by Cloud 4 India professionals to arrange/provide the requested data including transportation cost if any.</p>

<p><strong>28.5 Prohibited Activities/Workloads</strong></p>

<p>The customer agree and warrant that customer will ensure that Cloud 4 India infrastructure or services are not being used by any of its end-users for prohibited activities including but not limited to the following:</p>
<ul>
  <li>Crypto-currency</li>
  <li>Adult sites</li>
  <li>Chance based gaming</li>
  <li>VOIP Solutions</li>
  <li>UDP Based Gaming</li>
  <li>Reseller Hosting</li>
  <li>Use, provisioning or enablement of any software or techniques for anonymization specifically used to hide end-user real IP address for posting or publishing any content or performing any interactions with third parties where identification is generally required is prohibited including but not limited to use of VPN software like Open VPN, OpenVPN, proxy software, public VPNs, Tor nodes, torrent nodes etc. However, anonymization can be used on datastores where anonymization is specifically required to meet the requirements of the law</li>
  <li>Un-managed Shared Hosting</li>
</ul>

<p><strong>The above is not a comprehensive list of prohibited activities and all activities as prohibited by law or under Cloud 4 India Terms of Services shall be considered as prohibited activities for the purpose of this clause.</strong></p>`;

      // MSA & SLA default content
      const msaSlaContent = `<h1>MSA & SLA</h1>

<h2>Master Service Agreement</h2>

<p>This Agreement is made and entered into on this __ day of _______ (Effective Date) by and between <strong>CLOUD 4 INDIA</strong> (hereinafter referred to as "C4INDIA"), a company incorporated under the Companies Act, 1956, and having its registered office at 3052 "Prestige Finsbury Park Hyde" Aerospace Park, Bagalur KIADB, Bengaluru, 562149 India having datacenter at H223, Rasoolpur, Sector 63, Noida, Uttar Pradesh 201301 and Plot No 13, Bakhtawarpur, Sector 127, Noida and CUSTOMER COMPANY (hereinafter referred to as the Customer), a company incorporated under the Companies Act, 1956/any other specify, and having its registered office at CUSTOMER ADDRESS</p>

<h3>1. DEFINITIONS</h3>

<p>In this Agreement, the following words and expressions, unless inconsistent with the context, shall bear the meanings assigned thereto:</p>

<ol type="i">
  <li><strong>"Customer Area"</strong>: means the rack or any space provided by Service Provider to Customer where the server of Service Provider is located for the purpose of providing Services.</li>
  <li><strong>"Customer Agreement Form (CAF)"</strong> means the form prescribed by C4INDIA, for provisioning of Services to the Customers and includes this MSA and SLA along with Annexure, as executed by the Customer.</li>
  <li><strong>"Facility"</strong>: The facility is located at office of C4INDIA Datacenter in Uttar Pradesh where Service Provider provides space, racks for placing the servers.</li>
  <li><strong>"Fees"</strong>: means the amount invoiced by Service Provider other than the Initial Term fees to be paid to by the Customer for use of services provided by Service Provider.</li>
  <li><strong>"Master Service Agreement"</strong>: means the agreement which the Customer had acknowledged and agreed to the terms mentioned herein.</li>
  <li><strong>"Network"</strong> means the portion internal computer network owned or operated on behalf of Service Provider that extends from the outbound port on a Customer's cabinet switch to the outbound port on the border router and includes all redundant internet connectivity, bandwidth, routers, cabling and switches.</li>
  <li><strong>"Representatives"</strong> means any person who is nominated or appointed by the Customer to visit the Facility center.</li>
  <li><strong>"Service Catalogue"</strong> shall contain all or any of services/facilities viz., back up facility, dedicated firewall facility, hardware monitoring facility, help desk support, load balance server, network and power uptime, OS management, shared firewall service and Version Control described in Annexure A to this SLA which may be availed by the Customer along with the Services as mentioned in the OF from Service Provider.</li>
  <li><strong>"Service Outage"</strong> shall mean an unscheduled disruption/failure in any Service offered by Service Provider as per this Agreement, due to which Customer's server is un-accessible to Customer. The outage of Services due to, but not limited to the following shall be a Service Outage.</li>
  <li>Customer is unable to transmit to or receive information from his network equipment because Service Provider failed to provide facility services to its network equipment including, switch, router, firewall etc. Failure of Services like Internet connectivity, IDC LAN etc. shall also be treated as Service Outage.</li>
  <li><strong>"Space"</strong> The Portion of rack which is leased/licensed to Customer for placing their server.</li>
  <li><strong>"Setup Charges"</strong> means all charges which may be incurred by C4INDIA for installing the server or any other expenses incurred for the commencement of Services to the Customer.</li>
  <li><strong>"Support Desk"</strong> shall be the location where the Customer should report a fault. Details of the same are mentioned in annexure or if changed, may be intimated from time to time by Service Provider to the Customer.</li>
  <li><strong>"Total Uptime Hours"</strong> shall mean 24 hours, 365 days a year. (Year is defined as period of 365 days) <strong>"Trouble Ticket"</strong> means issuing a ticket with a unique identification number confirming the customer complaint logging in with Service Provider in relation to a Service Outage faced by the Customer.</li>
</ol>

<h3>2. Services</h3>
<p>C4INDIA will provide the service(s) as defined in ANNEXURE I.</p>

<h3>3. Fees/Charges</h3>
<ol type="i">
  <li>Customer shall pay C4INDIA all fees/charges including monthly/quarterly/annual, as the case may be data transfer fees and excess usage fees, if any indicated on sales order ("Order") attached to as Annexure – II to this agreement. Customer acknowledges that in consideration of the discounted pricing set forth in the Order, if any, Customer commits to be liable for and pay the monthly fees set forth in an order for the term indicated in such order. (Including excess usage fees)</li>
  <li>Customer shall be liable in case it utilizes bandwidth/data transfer in excess of what he has agreed for and shall reimburse C4INDIA for such excess usage per GB (as per the excess usage charges indicated in the proposal). Bandwidth/data transfer usage shall only be monitored through MRTG (a bandwidth monitoring software, info of which is available on www.mrtg.com) using Simple Network Management Protocol (SNMP) to measure data transferred. The reports obtained from MRTG will be final and binding on Customer. C4INDIA at its own discretion reserves the right to change the Bandwidth/data transfer usage-monitoring software an intimation of which shall be given to the Customer. Moreover, C4INDIA shall not be responsible for any excess/normal usage if the traffic generated is due to some malfunction of hardware, software or due to configurations done by the customer. The customer also agrees that it will be paying for the excess usages generated by any virus/Trojans, etc.</li>
  <li>All payments shall be made by Cheque or Demand Draft drawn in favor of "C4INDIA" payable at Bengaluru, and it is to be sent to the address indicated in this Agreement or at such other address as C4INDIA may from time to time indicate by proper notice to customer. No Outstation Cheques shall be accepted. Customer shall pay payments in advance for the service period. C4INDIA shall raise invoice at least 15 days before the start of the period and send the same to the customer. All invoices shall be due and payable within fifteen (15) days of C4INDIA's date of invoice. Customer shall be liable to pay interest at the rate of one and half percent (2%) per month on all overdue and unpaid invoices.</li>
  <li>Customer shall pay, indemnify and hold C4INDIA harmless from all sales, service, value-added or other taxes of any nature, other than taxes on C4INDIA's net income, including penalties and interest, and all government permit or license fees assessed upon or with respect to any fees (except to the extent Customer provides C4INDIA with a valid tax exemption certificate). If any applicable statutory provision of law requires Customer to withhold amounts from any payments to C4INDIA hereunder, then Customer shall affect such withholding, remit such amount to the appropriate taxing authorities and promptly furnish C4INDIA with tax receipts evidencing the payments of such amounts.</li>
</ol>

<h3>4. Term</h3>
<p>The terms of this Agreement shall commence on the date of its execution by the Customer and shall be reviewed on an annual basis within the terms of this Agreement, and provided further, that with regard to any orders then outstanding, this Agreement shall continue to govern such Orders until such orders have been fully performed or terminated. The Agreement shall be deemed to be automatically renewed at the then current fees for additional periods, unless either party gives written notice otherwise to the other party, not less than thirty (30) days prior to the expiration of such order. This Agreement may be renewed for Additional Terms upon the mutual written consent of both parties.</p>

<h3>5. Termination</h3>
<ol type="i">
  <li>Either party may terminate this Agreement or any order upon written notice: (a) for any material breach of this Agreement or any Order which the defaulting party fails to cure within fifteen (15) days following written notice by the non-defaulting party of such breach; or (b) upon either party's insolvency or liquidation as a result of which either party ceases to do business. Notwithstanding anything herein to the contrary, C4INDIA may terminate this Agreement or any Order without notice immediately for any breach under this Agreement.</li>
  <li>Customer shall comply with all applicable procedures of C4INDIA related to equipment removal upon termination. In the event of any expiration or earlier termination of this Agreement or any Order, Customer will be obligated to pay to C4INDIA full contract period fees and charges unless such termination is the result of C4INDIA's default, the payment of any waived or discounted installation fees, as well as monthly fees for each remaining month of the term of the affected Order(s).</li>
</ol>

<p>In addition, if Customer fails to pay any invoice(s) for fifteen (15) days or more from the date of such invoice, Customer C4INDIA shall deny access to the Space and the equipment of the customer placed with the C4INDIA shall not be released until such time till the invoice(s) has been paid in full.</p>

<p>If the default continues for further 15 days, then C4INDIA shall be entitled to retain and sell the equipment of the customer placed with C4INDIA and in case of any loss in selling the equipment, same shall be borne by the customer. C4INDIA shall not be responsible if any loss incurs in the selling of the equipment and in case the equipment is sold for an amount higher than what is to be recovered, such excess amount shall be paid back to the customer.</p>

<h2>Service Level Agreement (SLA)</h2>

<h3>1. SCOPE OF THE SERVICES</h3>

<p>C4INDIA may provide such Services as provided in the Service Catalogue provided in Annexure A to this SLA. The Customer may issue one or more purchase orders to C4INDIA for Services and C4INDIA shall accept a purchase order only if it is in accordance with the terms of this Agreement and for services as covered by the Service Catalogue.</p>

<p>C4INDIA assures Customer that it shall provide its immediate support and assistance in the event of any disruption in the Services being provided by C4INDIA. The manner and time frame for troubleshooting and the timelines for the resolution of the problems are mentioned in the Annexure A of this Agreement.</p>

<p>Services will be provided to the Customer by C4INDIA with the infrastructure available at its data center which consists of the following:</p>
<ul>
  <li>Dual active power sources from two different power generation plants.</li>
  <li>Tier III – (system) + (system) Architecture – Fault Tolerant with No Single Point of Failure</li>
  <li>Capability to provide 99.95 % SLA</li>
  <li>Carrier Neutral Data center</li>
  <li>ISO 20000-1 & 27001 Certified</li>
</ul>

<p>C4INDIA assures the Customer 99.995 % uptime availability of the Infrastructure viz., Power and Cooling** covered by this SLA. Hardware Uptimes SLA would be 4 hours resolution from the time of detection of hardware problem either by C4INDIA help desk or by the Customer. Subject to Clause 3 of this SLA, in the event C4INDIA fails to provide the Customer with the Services required by the Customer in accordance with the SLA, such failure resulting from complete unavailability of C4INDIA network, such events will be treated as "Qualified Network Downtime Event" for which C4INDIA will issue the Customer a Service Credit – calculated as per method provided in Clause 2.5.</p>

<p>** C4INDIA assures Customer that it will provide cooling @ 21°C (+/-) 2°C and Humidity levels @ 50 % (+/-) 5%.</p>

<p>The Actual Uptime (A) calculated in the respective month and it will be measured (compared) against the total uptime hours of the year 99.995%. If the outages exceed total uptime hours the following service credits shall be due to Customer:</p>

<ul>
  <li>A >= 99.995% No Credits</li>
  <li>A in between 99.994% to 99.000% 2 days equivalent service credit for the Service period affected calculated on a prorate basis.</li>
  <li>A in between 98.999% to 98.000% 7 days equivalent service credit for the Service period affected calculated on a prorate basis.</li>
  <li>A is < 98% 15days equivalent service credit for the Service period affected calculated on a prorate basis</li>
</ul>

<p>Calculation of Actual Uptime % = (Total Uptime Hours – Actual Downtime) / Total Uptime Hours x 100.</p>

<p>The Customer is required to provide a preventive maintenance window, once in every quarter to enable C4INDIA to update the various patches and carry out other preventive maintenance. The time required to carry out this preventive maintenance by C4INDIA shall depend upon the environment of the Customer and shall be informed to the Customer before the time window is sought. During this window, Customer's environment shall not be available and the same shall not be counted as Downtime.</p>

<p>For the customized solutions provided by C4INDIA, preventive maintenance is absolutely essential and the SLAs offered by C4INDIA are based on the explicit understanding that the Customer will provide opportunity for C4INDIA to carry out preventive maintenance from time to time. In case the Customer does not provide, at least once in a quarter, the requisite downtime to carry out preventive maintenance activities, even after a request is made by C4INDIA, C4INDIA shall not be liable to provide any Service Credits or any other compensation in case of Downtime or any other loss to Customer such as data loss, denial of service or virus attacks.</p>

<p>C4INDIA shall recommend usage of high availability architecture for all critical loads, wherein there is a duplication of critical elements. For instance, this may be two power sources to a rack, or two firewalls in the network. In a high availability set-up, it is clarified that even when one of the elements fail, but the other is still running, then the entire set- up/solution/system/environment is considered to be available and the same shall not be counted as Downtime.</p>

<h3>2. EXCEPTIONS</h3>

<p>The following events do not constitute a Downtime and shall not be eligible to be considered for any Service Credit:</p>

<ul>
  <li>Interruption due to scheduled maintenance, alteration, or implementation, where the Service Provider provides at least seven days prior notice and to the Customer and also interruption due to Emergency Maintenance; The usual scheduled maintenance time is the early hours of the morning i.e., between 1am to 6am. The usual maintenance time would not be more than two hours.</li>
  <li>The quarterly maintenance window as described in clause 2.6 above.</li>
  <li>Hardware failure</li>
  <li>Failure of the Customer links, internet connectivity or end user software, access circuits, local loop or any network not owned or managed by C4INDIA.</li>
  <li>DNS Issues not in scope and control of C4INDIA.</li>
  <li>Negligence or other conduct of Customer or its authorized persons, including a failure or malfunction resulting from applications or services provided by Customer or its authorized persons;</li>
  <li>A shut down due to circumstances reasonably believed by C4INDIA to be a significant threat to the normal operation of the Services, C4INDIA's facility, or access to or integrity of Customer data (e.g., hacker, virus attack, ransomware attack or such nature of interruptions)</li>
  <li>Force majeure event which includes natural disaster i.e., flood, earthquake etc.</li>
  <li>Data loss due to above mention natural events or cyberattacks</li>
  <li>Failure or malfunction of any equipment or services not provided by C4INDIA;</li>
  <li>Any abuse or fraud failure to comply with the Acceptable User Policy on the part of Customer and its authorized persons.</li>
  <li>Any problems outside the Service Provider Facility Network.</li>
  <li>Any interruptions, delays or failures caused by Customer or Customer's employees, agents, or subcontractors, such as, the following:
    <ul>
      <li>Inaccurate configuration.</li>
      <li>Non-compliant use of any software installed on the server.</li>
      <li>Customer initiated server over-utilization.</li>
    </ul>
  </li>
  <li>Any problems related to the attacks on the machine such as hacking, attacks, and exploits.</li>
</ul>

<h3>3. SERVICE CREDIT</h3>

<p>C4INDIA agrees that it shall provide for the requisite service credits to the Customer in the event of it not being able to provide the Services for which it had already received the payments.</p>

<p>C4INDIA agrees that on occurrence of any event that attracts service credits the Customer would be eligible to request a Service Credit on compliance of the terms as mentioned in Clause 6.1. (a) of this SLA.</p>

<p>Customer shall be eligible for Service Credit for only those Downtimes which has occurred a month prior to the date of claim and the maximum Service Credit to which Customer shall be entitled is as mentioned in Clause6.1.(c).</p>

<h3>4. PAYMENT TERMS</h3>

<p>The Customer shall pay all the charges as set out in the Agreement which includes one-time setup charges, recurring charges and other supplemental charges for any Supplemental Services provided including before the Service Commencement Date.</p>

<h3>5. PROCEDURE FOR AVAILING SERVICE CREDITS</h3>

<p>Whenever the Customer encounters Service Outage, the following procedure should be followed;</p>

<ul>
  <li>The Customer should contact C4INDIA "Support Desk" without undue delay and shall request for a Trouble Ticket number immediately and can track the Trouble Ticket number till the Trouble Ticket is closed on resolution of the outage.</li>
  <li>C4INDIA on the receipt of the issue of Trouble Ticket to the Customer shall have a background check to verify if the Customer is eligible for the Service Credit.</li>
  <li>When C4INDIA fails to provide Services in accordance of the SLA entitling Customer for Service Credits, C4INDIA shall credit the Customer's account the prorated base charges from the day the Trouble Ticket is issued to Customer till the Trouble Ticket is closed on resolution of the outage.</li>
</ul>

<p>Service Credits will be adjusted after end of existing contract by giving additional service Days.</p>

<h3>TROUBLESHOOTING & RESOLUTION TIMES</h3>

<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>Priority</th>
    <th>Priority Definition</th>
    <th>Mean Time to Assist (MTTA)/ Response Time</th>
    <th>Mean Time to Repair (MTTR)/ Resolution Time</th>
    <th>Updates</th>
  </tr>
  <tr>
    <td>High</td>
    <td>Out of Service –Eg: N/W, Device Down, Power Down or Infrastructure down at C4INDIA Datacenter Premises.</td>
    <td>15 minutes*</td>
    <td>8 Hours</td>
    <td>1 Hour Interval</td>
  </tr>
  <tr>
    <td>Medium</td>
    <td>Partial/Intermittent Service Interruptions – Eg: System, N/W performance degraded but still functioning. (For services being provided by C4INDIA and inside its premises)</td>
    <td>30 minutes*</td>
    <td>24 Hours</td>
    <td>4 Hour Interval</td>
  </tr>
  <tr>
    <td>Low</td>
    <td>All Change requests, Access Requests etc.</td>
    <td>1 Hour *</td>
    <td>48 Hours</td>
    <td>12 Hours</td>
  </tr>
</table>

<p>* Time starts when the problem is detected by C4INDIA Help Desk team or reported by the customer and ends on assistance/repair as applicable &</p>
<p>* Resolution norms for different hardware problems will depend on the SLAs with respective vendors</p>

<ul>
  <li>95% of the calls will be attended to within the stipulated response time – Measured on a quarterly basis.</li>
  <li>90% of the calls will be closed within the stipulated resolution time – Measured on a quarterly basis</li>
  <li>Resolution norms will not include WAN link</li>
</ul>

<p>In Case Of Outage: C4INDIA's IDC will communicate to Customer any outages related to Managed Services elements within 20 minutes of observation of fault through NMS or escalation by its Engineers.</p>

<p><strong>** Logging of complaint is mandatory to ensure that fault ticket number is generated for further reference & auto escalation through our work flow system.</strong></p>

<h3>6. WARRANTIES OF C4INDIA</h3>

<p>Additional Warranties of C4INDIA in regards to SLA:</p>

<p>C4INDIA warrants that it shall perform and provide Services in a professional and workmanlike manner in accordance with this Agreement.</p>

<h3>7. REPRESENTATIONS OF CUSTOMER</h3>

<p>Additional Warranties of Customer in regards to SLA.</p>

<ol>
  <li>The Customer will not do any voice communication from anywhere to anywhere by means of dialing a telephone number (PSTN/ISDN/PLMN) as defined in National Numbering plan. The customer will not originate the voice communication service from a Telephone in India and/or terminate the voice communication to any Telephone within India.</li>
  <li>The Customer will not establish any connection to any public switched Network (i.e. telephone voice network) in India and will not use any dial up lines with outward dialing facility from Nodes.</li>
  <li>Customer acknowledges and will not establish any interconnectivity between ISPs for the purposes of offering Internet Telephony Services.</li>
</ol>

<h3>8. NETWORK SECURITY</h3>

<p>For securing the servers of clients against any NW threats, the following are implemented: Firewall, IPS and Antivirus etc. However, Customer can opt for dedicated security gadgets by paying the relevant charges.</p>

<h3>9. MANAGING OS AND DB</h3>

<p>Setup and administering the OS, DB and HW including the patches updation for the servers for OS and DB will be taken care of by C4INDIA as and when required. OS is provided with license and accordingly charged.</p>

<h3>10. SERVER AND DB MANAGEMENT</h3>

<p>OS and DB management will be provided by C4INDIA to the Customer, if opted for and charged accordingly.</p>

<h3>11. CLIENT ACCESS TO THE SERVERS</h3>

<p>Customer is allowed to access their server only after providing the PO to C4INDIA. The Customer is provided with 1 IP and 24x7x365 monitoring of servers is maintained.</p>

<h3>12. DISCLAIMER</h3>

<p>With a commitment and desire to offer the best possible technology to the Customer and evolutions in technology, C4INDIA shall upgrade its platform from time to time. Accordingly, C4INDIA reserves its right to change the platform without any change in the service levels committed.</p>

<h3>Schedule A to Annexure-1</h3>

<p>As mentioned in the Service Catalogue the following Services will be provided by C4INDIA. In the event there is a disruption in Service or alarm is triggered, the troubleshooting and resolution of the problem in respect of each Service, where applicable, shall be as follows:</p>

<p>C4INDIA will use reasonable efforts to resolve problems as quickly as possible. As C4INDIA offers this service based on a combination of third-party Hardware & Software, C4INDIA will not offer any service credits to the Customer in case of non-availability of his web site due to a problem with not having a redundant architecture in their set up. In such cases, C4INDIA will work with the customer to remedy problems at the earliest.</p>

<h3>Terms and Conditions</h3>

<p>C4INDIA reserves the right to modify the server manufacturer at any time. In the event that C4INDIA changes the server manufacturers, customers are assured that the specifications contracted will remain the same. Please contact us for details pertaining to any other server configurations that might be available.</p>

<p><strong>Note:</strong> In case C4INDIA has not provided the licensed software, it is the responsibility of the Customer to provide licensed software. C4INDIA does not take any responsibility if the customer has not complied to any laws of Licensing.</p>`;

      // Refund Policy default content
      const refundContent = `<h1>Refund Policy</h1>

<p>CLOUD 4 INDIA reserves the right to cancel, suspend, or otherwise restrict access to the account at any time with or without notice.</p>

<p>Customers may cancel at any time via a support ticket or emailing support [at] <a href="https://www.cloud4india.com/">Cloud 4 India.com</a>. Cloud 4 India gives you 7 days money back guarantee on managed shared hosting, and reseller solutions for any customer who paid the first invoice with a credit card, Bank transfer or through payment gateway</p>

<p>There are no refunds on dedicated servers, mail servers, domain name registration, administrative fees, and install fees for custom software. Any domain name purchases are non-refundable. Please note that domain refunds will only be considered if they were ordered in conjunction with a hosting package. Eligibility of said refunds will be determined at the time of cancellation.</p>

<p>Only first-time accounts are eligible for a refund. For example, if you've had an account with us before, canceled and signed up again, you will not be eligible for a refund or if you have opened a second account with us.</p>

<p>For Bank Transfers, there will be minimum banking charges of Rs 250/- when refunds is requested as there is no facility for us to directly refund in to your account. Company Cheque will be deposited to your account when refund is requested within 7 days once refund is approved.</p>

<p>Violations of the Terms of Service will waive the refund policy.</p>`;

      // Insert default pages
      const pages = [
        { slug: 'privacy', title: 'Privacy Policy', content: privacyContent },
        { slug: 'acceptance-user-policy', title: 'Acceptance User Policy', content: aupContent },
        { slug: 'msa-sla', title: 'MSA & SLA', content: msaSlaContent },
        { slug: 'terms', title: 'Terms & Conditions', content: termsContent },
        { slug: 'refund-policy', title: 'Refund Policy', content: refundContent }
      ];

      const insertPage = db.prepare(`INSERT OR REPLACE INTO integrity_pages (slug, title, content, is_visible) VALUES (?, ?, ?, 1)`);
      pages.forEach(page => {
        insertPage.run(page.slug, page.title, page.content);
      });
      insertPage.finalize((err) => {
        if (err) {
          console.error('Error inserting integrity pages:', err.message);
          reject(err);
        } else {
          console.log('✅ Inserted default integrity pages');
          console.log('\n🎉 All Integrity pages tables created and populated with default data!');
          resolve();
        }
      });
    });
  });
};

// Run migrations
createTables()
  .then(() => {
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
        process.exit(1);
      }
      console.log('✅ Database connection closed');
      process.exit(0);
    });
  })
  .catch((err) => {
    console.error('❌ Migration failed:', err.message);
    db.close();
    process.exit(1);
  });

