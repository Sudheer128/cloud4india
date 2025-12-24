/**
 * Update Terms & Conditions page content
 * Based on Terms_AND_Conditions.txt file
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

const termsContent = `
<h1>Terms of Service</h1>

<p>Cloud 4 India India Private Limited ("Cloud 4 India", "we", "us") provides cloud platform and configuration services, including but not limited to smart dedicated servers, object storage, content delivery network service and continuous data protection backup services ("Services"). Except as otherwise indicated, customers using the Services shall be referred to as "you" or "your".</p>

<p>We provide these Services, subject to the terms of this document ("Terms"). Your use of the Services or your registration with us constitutes your agreement to these Terms. If you purchase our Services through a separate written agreement/master services agreement, these Terms shall be deemed to be incorporated into that agreement, whether it is specifically called out or not. When you access or use our Website and/or the Services, these Terms shall apply and shall be legally binding on you and to your access and use of the same even if not accepted by you separately.</p>

<p>These Terms constitute a binding legal contract required to use our Infrastructure, website and Services. As such, you may only use our Infrastructure, website and Services if you agree to be bound by these Terms. We may modify these Terms at any time by posting a revised version of the same at www.cloud4india.com, on our website ("Website"), and the amended version of these Terms shall become automatically binding on you if you continue to avail of the Services. The amended terms will be applicable even if not accepted by you separately. If you do not wish to be bound by the updated Terms, we request you to stop accessing the Website and the Services and to reach out to us to deactivate your Customer Account. You shall have the responsibility to review these Terms on a regular basis.</p>

<hr>

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

<p><strong>1.11 "Government Authority(ies)"</strong> shall mean:</p>
<ol style="list-style-type: lower-alpha;">
<li>a government, whether foreign, federal, state, territorial or local which has jurisdiction over Cloud 4 India;</li>
<li>a department, office or minister of a government acting in that capacity; or</li>
<li>a commission, agency, board or other governmental, semi-governmental, judicial, quasi-judicial, administrative, monetary or fiscal authority, body or tribunal.</li>
</ol>

<p><strong>1.12 "Infra Credit Prepaid Customer"</strong> shall mean a customer who gets infra credits which can be used for availing various services being provided by us.</p>

<p><strong>1.13 "Inherent Business Risk"</strong> means those risks that are in the ordinary course associated with the provision of cloud services, including but not limited to loss of data due to attack on our servers by Malware, malfunction of our servers and other equipment under our control, malfunction of our software or supporting Third-Party Software.</p>

<p><strong>1.14 "Inactive Customer"</strong> shall mean a customer who, at any point of time, has not consumed or utilised any of the Services in the preceding 90 (Ninety) days.</p>

<p><strong>1.15 "Intellectual Property" or "IP"</strong> includes patents, trademarks, service marks, trade names, registered designs, copyrights, rights of privacy and publicity and other forms of intellectual or industrial property, know-how, inventions, formulae, confidential or secret processes, trade secrets, any other protected rights or assets and any licences and permissions in connection therewith, in each and any part of the world and whether or not registered or registrable and for the full period thereof, and all extensions and renewals thereof, and all applications for registration in connection with the foregoing and "Intellectual Property Rights" or "IPR" shall mean all rights in respect of the Intellectual Property.</p>

<p><strong>1.16 "Losses"</strong> shall mean any loss, damage, injury, liabilities, settlement, judgment, award, fine, penalty, fee (including reasonable attorneys' fees), charge, cost or expense of any nature incurred in relation to a Claim(s).</p>

<p><strong>1.17 "Malware"</strong> shall mean any malicious computer code such as viruses, logic bombs, worms, trojan horses or any other code or instructions infecting or affecting any program, software, client data, files, databases, computers or other equipment or item, and damaging, undermining or compromising integrity or confidentiality, incapacitating in full or in part, diverting or helping divert in full or in part an information system from its intended use.</p>

<p><strong>1.18 "Managed Services"</strong> shall mean the provision of professional services for additional payment to a customer by us to enable management of cloud computing infrastructure. Unless specifically stated, the Services provided to you shall be deemed to be "Self-Managed Services" and not "Managed Services".</p>

<p><strong>1.19 "Material Adverse Effect"</strong> shall mean any state of facts, change, development, effect, condition or occurrence that adversely affects either party's ability to perform its obligations under these Terms.</p>

<p><strong>1.20 "Person"</strong> shall mean any natural person, limited or unlimited liability company, corporation, general partnership, limited partnership, proprietorship, trust, association, or other entity, enterprise, or business organisation, incorporated under Applicable Law or unincorporated thereunder, registered under Applicable Law or unregistered thereunder.</p>

<p><strong>1.21 "Minimum Billing Amount"</strong> shall mean the minimum amount of usage charges pertaining to a particular service provided by us for a calendar month regardless of the actual time-based usage of such service during such calendar month.</p>

<p><strong>1.22 "Refund Policy"</strong> means the Refund Policy published on the Website accessible at https://www.cloud4india.com as may be amended by us from time to time. The most current version would always be published on the Website.</p>

<p><strong>1.23 "Privacy Policy"</strong> means the Privacy Policy published on the Website accessible at https://www.cloud4india.com, as may be amended by us from time to time. The most current version would always be published on the Website.</p>

<p><strong>1.24 "Service Level Agreement" or "SLA"</strong> means the Service Level agreement published on the Website and accessible at https://www.cloud4india.com, which sets out the service levels that we offer with respect to our Services. This may be amended from time to time at our sole discretion and the most current version would always be published on the Website.</p>

<p><strong>1.25 "TDS"</strong> shall mean tax deducted at source in accordance with Applicable Law.</p>

<p><strong>1.26 "Term"</strong>. These Terms shall be binding on you from the date on which you begin to avail the Services from us and shall remain valid till you continue to avail the Services.</p>

<p><strong>1.27 "Third Party"</strong> shall mean a Person except you and us.</p>

<p><strong>1.28 "Variable Usage Charges"</strong> shall mean the Charges that may vary depending on the usage of any Cloud 4 India service by you and which may increase over a period of time due to increase in use without any explicit action being taken by you to avail such additional usage.</p>

<p>For instance, the Variable Usage Charges with respect to the backup services being availed by you shall increase over a period of time based on your backup frequency, the increase in data being backed up on the servers and the peak storage usage in a calendar month.</p>

<hr>

<h2>2. USE OF THE SERVICES</h2>

<p><strong>2.1</strong> By availing the Services, you are required to comply with these Terms and all other operating rules, policies and procedures that may be published from time to time on the Website, including but not limited to the Privacy Policy, SLA and Refund Policy ("Company Policies").</p>

<p><strong>2.2</strong> When you register for our Services with us, you may be required to provide us with some information about yourself, such as your name, email address, and a valid form of payment, and you may also provide other information about yourself on a voluntary basis. The collection of such account-related information, and our use and disclosure thereof, is subject to the terms of our Privacy Policy.</p>

<p><strong>2.3</strong> We may make commercially reasonable updates to the Services and the Company Policies from time to time.</p>

<p><strong>2.4</strong> We may, in our sole discretion, refuse to provide or continue providing the Website and Services to you at any time, for any reason, including but not limited to your failure to comply with these Terms. We reserve the right to deactivate, terminate, prevent access to, disable services for, and/or delete any customer accounts or access to the Website and Services at any time, at our sole discretion.</p>

<hr>

<h2>3. REPRESENTATIONS AND WARRANTIES</h2>

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
<ol style="list-style-type: lower-alpha;">
<li>any failure or nonconformance of the Services with specifications (as provided in the Agreement or otherwise) caused by or attributable to any associated or complementary products not supplied under the Agreement,</li>
<li>the quantity or quality of the products of Customer or the process of manufacture for/on which the Services or products are used,</li>
<li>damage, fault, failure or malfunction due to Force Majeure or normal wear and tear,</li>
<li>any attempt by any person other than Cloud 4 India's personnel or any person authorized by Cloud 4 India, to perform all or part of the Services and</li>
<li>Third Party Materials. The warranty and remedies are conditioned upon:
<ol style="list-style-type: lower-roman;">
<li>conformance with any applicable recommendations of Cloud 4 India, and</li>
<li>Customer promptly notifying Cloud 4 India of any defects in Services.</li>
</ol>
</li>
</ol>

<p>The Customer acknowledges that there are risks inherent in internet connectivity outside Cloud 4 India's sphere of influence that may result in the loss of Customer's privacy, confidential information, and property. Customer acknowledges that Cloud 4 India does not control the transfer of data over communications facilities, including the internet, and that the Services may be subject to limitations, delays, and other problems inherent in the use of such communications facilities. Cloud 4 India shall not be responsible for any delays, delivery failures, or other damage resulting from such problems. Cloud 4 India shall not be responsible for any issues related to the performance, operation or security of the Services that arise from Customer's content, applications or Third-Party Materials.</p>

<p><strong>3.4</strong> The Customer acknowledges and understands that Cloud 4 India is not privy to any data and/or information of the Customer ("Customer Data") because of the nature of provision of Services and it acts solely for hosting of the Customer Data. Cloud 4 India shall not be liable for any loss of Customer Data while availing the Services from Cloud 4 India unless Customer has opted and availed in the Services for data backup along with data assurance services. Under no circumstances will Cloud 4 India have any liability or responsibility for:</p>
<ol style="list-style-type: lower-roman;">
<li>the loss of Customer Data or other information unless caused by the gross negligence or willful misconduct of Cloud 4 India; and</li>
<li>security breaches, viruses, hacked servers, worms, or corrupted data including Customer Data, unless caused by the gross negligence or willful misconduct of Cloud 4 India.</li>
</ol>

<p><strong>3.5</strong> The foregoing sets forth the exclusive remedies of Customer and the sole liability of Cloud 4 India for claims based on failure of, or defect in, Services, whether such claim is based on contract, law, indemnity, warranty, tort (including negligence), strict liability or otherwise. <strong>THE FOREGOING WARRANTIES ARE EXCLUSIVE AND IN LIEU OF ALL OTHER WARRANTIES, WHETHER WRITTEN, ORAL, IMPLIED (BY STATUTE, COMMON LAW, TRADE USAGE, COURSE OF DEALING OR OTHERWISE) OR STATUTORY, INCLUDING ANY WARRANTY OF MERCHANTABILITY OR FITNESS FOR PARTICULAR PURPOSE.</strong> Cloud 4 India does not provide any representations or warranties other than those set out in Clause 3 above.</p>

<p><strong>3.6</strong> Cloud 4 India does not provide any representation or warranty in respect of any products or services provided by others. Cloud 4 India shall have no obligation for loss, liability or damage which results because:</p>
<ol style="list-style-type: lower-alpha;">
<li>Customer fails to utilize, operate or maintain the Services or any materials or equipment in connection with the Services in accordance with (i) applicable law and generally approved industry practices or (ii) the provisions of this Agreement or (iii) the provisions of any storage, operating or maintenance instructions furnished to Customer or (iv) data loss or business loss due to disaster or cyber-attacks (force majeure clause applies)</li>
<li>Customer breaches applicable law. Customer agrees to indemnify Cloud 4 India against any loss, liability, harm or damage that Cloud 4 India may suffer as a result of Customer's failure or breach as described in this clause.</li>
</ol>

<hr>

<h2>4. YOUR OBLIGATIONS</h2>

<h3>4.1 Customer Account</h3>
<ol style="list-style-type: lower-alpha;">
<li>You are responsible for monitoring the activities under your Cloud 4 India account ("Customer Account"), regardless of whether the activities are authorised or undertaken by you or your employees or by a Third Party (including but not limited to your contractors, agents or any End Users). We shall not be held or deemed responsible for any unauthorized access to the Customer Account.</li>
<li>You should ensure the setting of strong passwords and access control mechanisms and other data protection control measures prescribed under Applicable law in order to protect Customer Data and prevent unauthorised access to the Customer Account.</li>
<li>You should immediately notify us of any unauthorized use of the Customer Account or any other breach of security and cooperate with our investigation of service outages, security issues or any suspected breach of these Terms.</li>
<li>We shall not be held responsible for any security breach resulting due to your failure to implement and/or comply with security measures or due to any other cause, which in our opinion is beyond our control. All and any liability(ies) arising out of or in connection with such security breach shall be solely and totally borne by you, and neither you, nor your representatives having gained access to your Customer Account or any Third Party gaining unauthorized access to your Customer Account shall have any Claims against us for such liabilities.</li>
<li>You shall defend, indemnify and hold harmless, us, our Affiliates, or any of our respective employees, agents or suppliers ("Indemnified Parties"), from and against any and all Claims and/or Losses arising out of or attributable, whether directly or not, to such security breach.</li>
</ol>

<h3>4.2 Backup of Customer data</h3>
<p>You should take appropriate action to secure, protect and backup the Customer Data including programs, data, software and any other Customer Data. We shall not be under any obligation, while providing the Services to the Customer, under these Terms, to maintain any copy or back up Customer Data.</p>

<p>Notwithstanding that you are availing backup services from us, you shall remain responsible to ensure that adequate back-up is taken by you and to test the accuracy of such back up of Customer Data. We shall not be responsible for the same. Further, you shall be liable to pay us, without dispute, any Minimum Billing Amounts and/or Variable Usage Charges that accrue due to the use of such backup services.</p>

<h3>4.3 Use of Licensed Software</h3>
<ol style="list-style-type: lower-alpha;">
<li>You hereby acknowledge that the software provided with the Services, is provided by Third Party(s) ("Third Party Software"). All Third Party Software is being licensed to you subject to terms and conditions of an End-User License Agreement (EULA) and you hereby agree to abide by the terms and conditions of the EULA associated with the Third Party Software.</li>
<li>You shall, at all times during the Term, be under the obligation to use the licensed version of the software to be used by you in relation to the Services. You shall not use any pirated software in availing the Services. Further, you shall be solely liable for any Losses or Claims arising out of your use (or use by the End Users) of any unmaintained open source software or any obsolete Third Party Software to run your workloads while using the Services and you shall accordingly indemnify, defend and hold harmless the Indemnified Parties.</li>
<li>If any Claims are made against the Indemnified Parties in relation to use of such Third Party Software by you, your representatives or End Users, without complying with the terms and conditions of the applicable EULA or due to such use of a license beyond the agreed upon or paid-for level, then you shall be liable for such Claims and any Losses arising out of the same, and shall hold harmless the Indemnified Parties.</li>
<li>We shall not be responsible for any Third Party Software, neither shall we be responsible for damage caused by such Third Party Software. Further, we may, in our sole discretion, at your request and on paid basis, configure the Third Party Software with your equipment, and the configuration of such software shall be done as per the instructions of the respective Third Party. Provided however that, this shall not be construed as imposing any obligation upon us to provide such services. We shall not be liable for any damages, whether such damages are direct, indirect or consequential, arising due to configuration of the Third Party Software with your equipment.</li>
<li>You shall be responsible to update any Third Party Software provided with the Services, as and when you receive notification from the Third Party Software provider. We shall not be responsible to ensure such update and we shall not be liable for any disruption in the Services on account of unforeseen software conflict or bug issues due to your failure to update the Third Party Software.</li>
<li>You shall not remove or tamper with the copyright, trademark or patent notices contained in the Third Party Software.</li>
</ol>

<p><strong>4.4</strong> You shall document and promptly report all errors or malfunctions noticed by you to Cloud 4 India. If you provide any feedback in relation to the Services, we shall be entitled to use such feedback to improve our Services, without incurring any obligations towards you.</p>

<p><strong>4.5</strong> You shall ensure that all legal compliances as per Applicable Laws/ applicable regulatory framework as may be required for you to access the Services, are fulfilled by you. You shall be responsible for the security of the Services (including the equipment used to access these Services) being availed by you and at no point of time, shall we be held responsible if the security of the Services or the related equipment employed by you is breached. You shall be responsible to take reasonable measures, including but not limited to encryption of data, for ensuring protection of data stored/uploaded by you through the Services.</p>

<p><strong>4.6</strong> In order to facilitate the provision of the Services, you shall provide us with the required assistance, as reasonably requested by us from time to time.</p>

<p><strong>4.7</strong> You should ensure the availability and stability of the computing environment to support the Services, if and to the extent required in connection with the delivery of the Services.</p>

<p><strong>4.8</strong> Neither you, nor your representatives and/or End Users, shall remove or tamper with the copyright, trademark or patent notices contained in any content provided by us in the course of providing the Services, or in the software provided by us (which shall not include Third Party Software). You shall defend, indemnify and hold harmless the Indemnified Parties from and against any and all Claims arising out of or attributable, whether directly or not, to the violation of this Clause 4.8 by you, your representative and/or the End Users.</p>

<p><strong>4.9</strong> You shall observe proper ethics and transparency in all your actions in the course of discharging your obligations under these Terms and you shall not, in any circumstances, take any action or make any statement that may mislead any other existing Cloud 4 India customer or prospective Cloud 4 India customer regarding the Services or Cloud 4 India itself, or impact Cloud 4 India's business or goodwill adversely.</p>

<p><strong>4.10</strong> You shall comply with all your obligations pursuant to these Terms and ensure that all payments due to us are paid in a timely manner in accordance with the due dates mentioned in the invoices/reminder emails sent by us.</p>

<p><strong>4.11</strong> You are responsible to monitor the functioning of resources utilised on your cloud server for the purpose of accessing the Services, and to undertake appropriate action to resolve any issues with respect to such server resources. In no event are we responsible to monitor or maintain such server resources.</p>

<hr>

<h2>5. SEIZURE OF DATA AND HARDWARE</h2>

<p><strong>5.1</strong> You agree that in case of any seizure of hardware provided by us to you for storage of any data or information pursuant to the Services, by any Government Authority, for the purpose of an investigation against you, your employees, agents or End Users, or for any other purpose as per the requirement of the Government Authority, you shall be liable to pay, without any protest or demur, upfront (i) the cost of providing such data or information to the Government Authority, and (ii) the cost of server or equipment seized by the Government Authority.</p>

<p><strong>5.2</strong> Further, you agree that we will not be liable to make any backup or copy the Customer Data stored on Cloud 4 India's server or equipment and you will not raise any Claim for loss of data including a monetary claim against us on account of loss of data. In case of seizure of hardware or data or both by the Government Authority, we will not be liable to inform you about such seizure of hardware or data or both, prior to or at the time of seizure of hardware or data or both by the Government Authority. Further, the Government Authority may provide such instructions for seizure of data or hardware or both through any mode of communication, whether in writing or by oral communication, and we will not be required to produce a copy of the written order of the Government Authority before the Customer.</p>

<hr>

<h2>6. BUSINESS RISK AND LOSSES</h2>

<p><strong>6.1</strong> You agree and acknowledge that the Services provided by us have Inherent Business Risk and such Inherent Business Risk may be beyond our control, and you may incur losses including but not limited to direct and indirect losses. We will not be liable, in whatever manner, for any losses incurred by you due to the foregoing. You hereby assume all risks arising out of the provision of the Services to you, your agents (including contractors and sub-contractors) or employees and shall indemnify, defend and hold harmless the Indemnified Parties from any and all Claims and/or Losses, caused by or arising in connection with any use or abuse of the same.</p>

<hr>

<h2>7. THIRD PARTY AUDIT</h2>

<p><strong>7.1</strong> You acknowledge that in respect of licenses/software acquired from Third Party(s), an audit may be conducted by competent Third Party(s) duly authorised to conduct the audit ("Competent Third Party(ies)") during the Term and you agree that in case of such audit being initiated by Competent Third Parties, you will cooperate and provide relevant information required by the Competent Third Parties. All our customers are expected to cooperate in case any Competent Third Party conducts an audit on our infrastructure, which shall include the cloud service platform provided by us. You will provide all information as may be requested by the Competent Third Party, which may include verification of licensing compliance, evidence of licenses for products used by you, etc. Further, in case you do not cooperate for the conduct of a Third Party audit, and fail to provide all information necessary for the proper conduct of such Third Party audit, then we, at our sole discretion, shall have a right to terminate the Services.</p>

<hr>

<h2>8. REGULATION OF USE OF SERVICES</h2>

<h3>8.1 Customer Data</h3>
<p>You hereby acknowledge that we exercise no control of whatsoever nature over the Customer Data. You represent and warrant to us that you have the right to transmit, receive, store, or host, using the Services, all Customer Data that you so transmit, receive, store, or host on our cloud platform. Further, it shall be your sole responsibility to ensure that you, your representatives and End Users who transmit, receive, store or host the Customer Data, comply with Applicable Law, and with any other policies published by us on the Website from time to time, including but not limited to the Company Policies. You will be solely responsible for the development, operation, maintenance and use of Customer Data.</p>

<p><strong>End User Customer Data:</strong> You shall be responsible for the End Users' use of the Customer Data and the Services and shall ensure that all End Users comply with your obligations under these Terms and Company Policies. Further, you shall ensure that the terms of your agreement with each End User is consistent with the terms of these Terms and the Company Policies. If you become aware of any violation of your obligations under these Terms caused by an End User, you should immediately suspend access to the Customer Data and the Services by such End User.</p>

<h3>8.2 Prohibited Activities</h3>
<p>You will not engage in any prohibited activities and will not permit any Person, including End Users using your online facilities and/or services, including but not limited to, your website(s) and transmission capabilities to do any of the following prohibited activities ("Prohibited Activities"):</p>

<ul>
<li>Host, display, upload, modify, publish, transmit, store, update or share any information that:
<ul>
<li>belongs to another person and to which the user does not have any right;</li>
<li>is defamatory, obscene, pornographic, paedophilic, invasive of another's privacy, including bodily privacy, insulting or harassing on the basis of gender, libelous, racially or ethnically objectionable, relating or encouraging money laundering or gambling, or otherwise inconsistent with or contrary to the laws in force;</li>
<li>is harmful to child;</li>
<li>infringes any patent, trademark, copyright or other proprietary rights;</li>
<li>violates any law for the time being in force;</li>
<li>deceives or misleads the addressee about the origin of the message or knowingly and intentionally communicates any information which is patently false or misleading in nature but may reasonably be perceived as a fact;</li>
<li>impersonates another person;</li>
<li>threatens the unity, integrity, defence, security or sovereignty of India, friendly relations with foreign States, or public order, or causes incitement to the commission of any cognizable offence or prevents investigation of any offence or is insulting other nation;</li>
<li>contains software virus or any other computer code, file or program designed to interrupt, destroy or limit the functionality of any computer resource;</li>
<li>is patently false and untrue, and is written or published in any form, with the intent to mislead or harass a person, entity or agency for financial gain or to cause any injury to any person;</li>
</ul>
</li>
<li>Send unsolicited commercial messages of communication in any form (SPAM);</li>
<li>Engage in any activities or actions likely to breach or threaten to breach any laws, codes, contractual obligations or regulations applicable to us or our customers;</li>
<li>Engage in any activity/ies or actions that would violate the personal privacy rights of others;</li>
<li>Intentionally omit, delete, forge or misrepresent online information;</li>
<li>Use Services for any illegal purpose, in violation of Applicable Law;</li>
<li>Conduct intended to withhold or cloak identity or contact information;</li>
<li>Use the Services to publish, post, share, copy, store, backup or distribute material that contains Malware;</li>
<li>Assign, sublicense, rent, timeshare, loan, lease or otherwise transfer the Services;</li>
<li>Remove or alter any proprietary notices like copyright, trademark notices, legends, etc.;</li>
<li>Reverse engineering, decompiling, except to the extent expressly permitted by Applicable Law;</li>
<li>Build or assist any Person to build a competitive solution using similar ideas, features, functions;</li>
<li>Attempt to probe, scan or test the vulnerability of the Services;</li>
<li>Modify, distribute, alter, tamper with, repair, or otherwise create derivative works;</li>
<li>Access or use the Services in a way intended to avoid incurring fees or exceeding usage limits;</li>
<li>Any activities that directly or indirectly result in criminal investigations by law enforcement authorities.</li>
</ul>

<h3>8.3 Abuse of Services</h3>
<p>Any activity/ies by you or facilitated by you, including but not limited to the activities as mentioned herein below, shall be regarded as abuse of service ("Abuse of Service"):</p>
<ul>
<li><strong>Denial of Service (DoS) / Distributed Denial of Service (DDoS):</strong> Flooding or overloading the network or network system with large number of communications requests compromises the availability of a network or network service.</li>
<li><strong>Restricting System Access or Storage:</strong> Using any manual or device, whether electronic or not, which limits, denies or restricts the access to a system or storage on a system.</li>
<li><strong>Operation of Certain Network Services:</strong> Operating network services like forged headers, open proxies, open VPN, public VPN services, open mail relays, or open recursive domain name servers, services that facilitate UDP reflection attacks, IP spoofing etc.</li>
<li><strong>Monitoring or Crawling:</strong> Monitoring or crawling of a system or combination of system and network that impairs or disrupts or leads to malfunctioning of the network.</li>
<li><strong>Deliberate Interference:</strong> Any interference with the proper functioning of any system or network or network services including any deliberate attempt to overload a system.</li>
</ul>

<h3>8.4 Consequences of Violations</h3>
<p>We may take actions in case of suspected violations of these Terms, Company Policies etc., including but not limited to:</p>
<ul>
<li>Written or verbal warning to you;</li>
<li>Suspend certain access privileges;</li>
<li>Suspend your Customer Account or Services;</li>
<li>Terminate your Customer Account or terminate/de-provision the Services in totality;</li>
<li>Bill you for any administrative costs and/or reactivation charges;</li>
<li>Institute any legal proceeding, civil or criminal as the case may be;</li>
<li>Forfeit any amount received as advance or otherwise from you.</li>
</ul>

<hr>

<h2>9. FACILITIES</h2>

<p><strong>9.1 Monitoring Equipment:</strong> We will install monitoring equipment or software to monitor your service usage for ensuring quality of service and for billing purposes. The Services can be affected by activities beyond our control even after installation of the equipment or software. We shall have no liability in the event of any loss to you due to activities beyond our control, including attacks by Malware.</p>

<p><strong>9.2 Usage Measurement:</strong> We may, at our discretion, measure the usage of Services which shall include but shall not be limited to any usage artefacts like number of HTTP(s) requests, inbound and outbound data traffic to and from various services, temperature of hardware on which Services are running etc.</p>

<p><strong>9.3 Service Requests:</strong> You shall raise a service request as per the method intimated by us. Currently, service requests can be raised by sending an email to us at <strong>support@cloud4india.com</strong>. Execution of service requests by us shall not be undertaken unless and until we receive a duly authorised confirmation from your listed technical contact.</p>

<hr>

<h2>10. SERVER REBOOTS (ON/OFF)</h2>

<p><strong>10.1</strong> You may undertake server on/off actions by yourself via the self-service portal accessible at https://www.cloud4india.com or such actions may be performed by our team on the receipt of a request from you. We shall have no liability or responsibility for your failure to properly execute such server on/off actions and the consequent delay in restart of the servers.</p>

<p><strong>10.2</strong> We may reboot, physically disconnect and reconnect the servers while undertaking scheduled and/or emergency maintenance. We shall not be responsible for failure of the servers to reboot successfully on account of incomplete filesystem consistency checks, misconfiguration in software, or manual changes made by us on receipt of a request from you.</p>

<hr>

<h2>11. MAINTENANCE AND SUPPORT</h2>

<p><strong>11.1</strong> We shall have the right to conduct routine scheduled maintenance or emergency maintenance of its electrical, software or hardware infrastructure required to operate our Services according to the maintenance schedule posted on the Website or communicated via email to you.</p>

<p><strong>11.2</strong> We will undertake best efforts to provide you round the clock support, monitoring, fault reporting and maintenance of the networks and systems at Cloud 4 India. We shall provide warranty support for the equipment supplied by us, subject to the terms and conditions of the equipment's manufacturer.</p>

<hr>

<h2>12. TERMS OF FREE TRIAL</h2>

<p><strong>12.1</strong> The terms of these Terms as well as any other terms stated to be applicable to the use of the Services shall govern 'free trial facility' being offered by us.</p>

<p><strong>12.2</strong> We shall have the discretion to grant a free trial facility to any potential customer and shall be entitled to do so on the basis of an evaluation of the specific service sought from us and such potential customer's needs.</p>

<p><strong>12.3</strong> We shall make best efforts to grant free trial facility within a period of 7 (Seven) days from receiving a request for the same from a potential customer.</p>

<p><strong>12.4</strong> We reserve the right, in our absolute discretion, to cancel or modify the free trial facility offered to you, at any time without prior notice.</p>

<p><strong>12.5</strong> In the event that it is brought to our notice that any activity that constitutes a violation of these Terms is undertaken by you, we shall have the right to immediately cancel the free trial facility without prior notice to you.</p>

<p><strong>12.6</strong> Notwithstanding the other provisions of these Terms, any liability(ies) arising out of or in connection with your use of the free trial facility, shall be solely and totally borne by you.</p>

<hr>

<h2>13. LIMITATION OF LIABILITY</h2>

<p><strong>13.1 IN ANY EVENT, OUR AFFILIATES' AND OUR LICENSORS' CUMULATIVE LIABILITY TOWARDS YOU OR ANY OTHER PARTY, IF ANY, FOR ANY LOSS OR DAMAGES RESULTING FROM ANY CLAIMS, DEMANDS, OR ACTIONS ARISING OUT OF OR RELATING TO THESE TERMS OR THE USE OF THE SERVICES OR ANY FAILURE OR DELAY IN DELIVERING THE SERVICES SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU, PURSUANT TO AN INVOICE RAISED BY US FOR ONE MONTH, IN THE MONTH PRIOR TO THE MONTH ON WHICH THE EVENT GIVING RISE TO THE CLAIM OCCURRED.</strong></p>

<p><strong>13.2 IN NO EVENT SHALL WE BE LIABLE TO YOU, FOR ANY SPECIAL, INDIRECT, INCIDENTAL, PUNITIVE, EXEMPLARY, RELIANCE, OR CONSEQUENTIAL DAMAGES OF ANY KIND, INCLUDING, BUT NOT LIMITED TO, COMPENSATION, REIMBURSEMENT OR DAMAGES IN CONNECTION WITH, ARISING OUT OF, OR RELATING TO, THE USE, OR LOSS OF USE OF THE SERVICES, LOSS OF PROFITS, LOSS OF GOODWILL, LOSS OF DATA OR CONTENT, COST OF PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, SUBSEQUENT OR OTHER COMMERCIAL LOSS, OR FOR ANY OTHER REASON OF ANY KIND.</strong></p>

<hr>

<h2>14. LIMITED WARRANTY</h2>

<p><strong>WE REPRESENT THAT WE SHALL MAKE BEST EFFORTS TO PROVIDE THE SERVICES IN COMPLIANCE WITH OUR SERVICE LEVEL AGREEMENT. EXCEPT FOR THIS WARRANTY, WE DISCLAIM ANY AND ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, RELATING TO THE SERVICES, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT, OR ARISING FROM A COURSE OF DEALING, USAGE OR TRADE PRACTICE. WE SPECIFICALLY DISCLAIM ANY WARRANTY THAT THE OPERATION OF THE SERVICE WILL BE UNINTERRUPTED OR ERROR FREE.</strong></p>

<hr>

<h2>15. CONSIDERATION</h2>

<p><strong>15.1 Escalation of charges:</strong> We reserve the right to revise the prices of any existing service plan and/or discontinue any existing plan or change its features, at our discretion. In case of any change in the service plan and/or service fee applicable to you, or if we discontinue any existing plans being billed to you, we will, to the extent deemed feasible, notify you of the same by email.</p>

<p><strong>15.2</strong> All payments shall be made by direct transfer (NEFT/RTGS), cheque or demand draft, drawn in favour of 'Cloud 4 India Private Limited' payable at New Delhi and no outstation cheques shall be accepted. You may also pay online from your Customer Account at 'Funds' using options namely net banking, credit card, debit card, standing instructions or autopay on debit/credit cards. All invoices raised against you will be due and payable as per the due dates / credit terms mentioned in the invoice and you will be liable to pay interest at the rate of one and half percent (1.5%) per month on all overdue and unpaid invoices.</p>

<p><strong>15.3</strong> We may use third-party payment processors/payment gateway partners to receive payment through the payment account(s) linked to your Customer Account. You acknowledge that we are not responsible for the acts or omissions of the payment gateway partners.</p>

<p><strong>15.4</strong> If you fail to pay amounts due under the invoices raised by us by the respective due dates, then we will be entitled to take suitable legal action in accordance with Applicable Law against you to recover outstanding dues on invoices.</p>

<p><strong>15.5</strong> If any amount is withheld by you from payments due to us pursuant to any statutory requirement, you should remit such amount to the appropriate Government Authorities and promptly furnish signed documentary evidence/certificate supporting such withholding to us. TDS certificates are required to be uploaded for every quarter:</p>
<ul>
<li>Certificates for quarters ending in June - by 20th August</li>
<li>Certificates for quarters ending in September - by 20th November</li>
<li>Certificates for quarters ending in December - by 20th February</li>
<li>Certificates for quarters ending in March - by 20th June</li>
</ul>
<p>Please share at: <strong>billing@cloud4india.com</strong></p>

<p><strong>15.6</strong> We shall have the right to require you to pay the full invoice amount along with applicable TDS (if any) and you will have the right to claim a refund of the requisite TDS amount paid to us on submitting the required duly signed TDS certificate(s), within the statutory timelines.</p>

<p><strong>15.7</strong> All fees payable by you shall be exclusive of goods and services tax ("GST"). We may charge and you will be required to pay GST and/or other taxes applicable to all payments required to be made toward our Services.</p>

<p><strong>15.8</strong> The Customer shall be responsible to provide valid GSTN in their Customer Account (https://www.cloud4india.com), if they are registered under the GST regime. If the GSTN provided by a customer is found to be inactive/cancelled/suspended at the time of Invoice generation or during the filing of GST returns by Cloud 4 India, then Cloud 4 India shall remove such invalid GSTN.</p>

<hr>

<h2>16. CONFIDENTIALITY</h2>

<p>You should safeguard and keep confidential Cloud 4 India's Confidential Information using measures that are equal to the standard of care used by you to safeguard your own Confidential Information of comparable value, but in no event less than reasonable care. You should not use our Confidential Information for any purpose except to implement your rights and obligations under these Terms and as otherwise expressly contemplated by these Terms.</p>

<hr>

<h2>17. SECURITY AND DISCLOSURE OF CUSTOMER DATA</h2>

<p><strong>17.1 Security Measures:</strong> You will be solely responsible to patch your systems regularly with security updates of operating systems, web server/DB or any other software in use on servers/services, maintain highest levels of input sanitation on your web applications and in general keep any protected data encrypted. Further, you should take reasonable security measures to ensure protection of Customer Data stored on our cloud servers linked to your Customer Account. We will on a best-efforts basis, implement reasonable and appropriate measures designed to help you secure your Customer Data against accidental or unlawful loss, access or disclosure.</p>

<p>However, you shall remain responsible for properly configuring and using the Services and taking your own steps to maintain appropriate security, protection and backup of your Customer Data. We do not promise to retain any preservations or backups of your Customer Data. You are solely responsible for the integrity, preservation and backup of your Customer Data.</p>

<p>We are not responsible or liable to make available data lost due to hardware failure or any other reason. While we will make our best efforts to help you retrieve your Customer Data (in the case of hardware failure), our responsibility is limited to providing you with an equivalent (replacement) compute node, as soon as possible.</p>

<p><strong>17.2 Disclosure of Customer Data:</strong> Notwithstanding that we may have access to the servers allocated to you for availing the Services, we do not by default maintain copies of Customer Data and/or logs of Customer activities on our platform or servers, unless expressly mandated by Applicable Law. Further, we will not disclose Customer Data to any Third Party, unless required to do so for the purpose of providing the Services to you or pursuant to an order or demand duly made by a Government Authority.</p>

<hr>

<h2>18. SUSPENSION OF SERVICES</h2>

<p><strong>18.1</strong> We may, in our sole discretion, suspend the Services, in whole or in part, without liability if:</p>
<ol style="list-style-type: lower-roman;">
<li>you fail to pay the Fees/Charges due and payable to us by the due date or credit term mentioned in the invoice/reminder emails,</li>
<li>you are an Infra Credit Prepaid Customer and you run out of infra credits on your Customer Account,</li>
<li>you or your End User is in violation of these Terms and/or the Company Policies,</li>
<li>you fail to reasonably cooperate with our investigation of any suspected breaches of these Terms,</li>
<li>we reasonably believe that our cloud platform has been accessed or manipulated by a Third Party without your consent or our consent,</li>
<li>we reasonably believe that suspension is necessary to protect the integrity, security, or availability of our Services.</li>
</ol>
`;

const eyebrow = 'Integrity';
const description = "Review Cloud4India's Terms of Service covering definitions, service usage, representations, warranties, customer obligations, and legal provisions governing our cloud platform services.";

console.log('🔄 Updating Terms & Conditions content...');

db.run(
    'UPDATE integrity_pages SET content = ?, eyebrow = ?, description = ?, updated_at = datetime("now") WHERE slug = ?',
    [termsContent, eyebrow, description, 'terms'],
    function (err) {
        if (err) {
            console.error('❌ Error updating Terms & Conditions:', err.message);
        } else {
            console.log('✅ Terms & Conditions content updated successfully!');
            console.log('   Rows affected: ' + this.changes);

            db.get(
                'SELECT id, slug, title, eyebrow, LENGTH(content) as content_length FROM integrity_pages WHERE slug = ?',
                ['terms'],
                (err, row) => {
                    if (err) {
                        console.error('❌ Error verifying update:', err.message);
                    } else if (row) {
                        console.log('📋 Verification:');
                        console.log('   ID: ' + row.id);
                        console.log('   Slug: ' + row.slug);
                        console.log('   Title: ' + row.title);
                        console.log('   Eyebrow: ' + row.eyebrow);
                        console.log('   Content length: ' + row.content_length + ' characters');
                    } else {
                        console.log('⚠️ No row found with slug "terms-conditions"');
                        // Try to find the correct slug
                        db.all('SELECT id, slug, title FROM integrity_pages', [], (err, rows) => {
                            if (!err) {
                                console.log('Available pages:');
                                rows.forEach(r => console.log('   - ' + r.slug + ': ' + r.title));
                            }
                            db.close();
                        });
                        return;
                    }
                    db.close();
                }
            );
        }
    }
);
