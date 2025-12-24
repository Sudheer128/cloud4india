/**
 * Update Acceptable User Policy page content
 * Based on screenshots from cloud4india.com/acceptance-user-policy.php
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

const newAUPContent = `
<h1>Acceptance User Policy</h1>

<ol>
<li>This Acceptable User Policy ("AUP") governs the usage of services of Cloud 4 India ("Services") pursuant to the Master Services Agreement dated Date entered between Cloud 4 India, hereby referred as 'Service Provider' and CUSTOMER NAME hereby referred to as 'Customer'. The terms not specifically defined herein shall have the meanings ascribed to them in the Master Services Agreement.</li>

<li>This AUP shall be incorporated by reference into each contract entered by CLOUD 4 INDIA with its Customer for availing the Services. In addition, this Policy shall also be incorporated by reference into the Master Service Agreement</li>

<li>This AUP helps and protects the Customer. Availing of Services by the Customer constitutes acceptance of this AUP.</li>

<li>All hosting services provided by CLOUD 4 INDIA shall be used by the Customer for lawful purposes only, and as per the applicable laws (including but not limited to privacy laws). Transmission, usage, storage, or presentation of any information, data or material in violation of applicable laws including the 'banned contents' is strictly prohibited. The 'banned contents' include but are not limited to:–
  <ol style="list-style-type: lower-roman;">
    <li><strong>Illegal Material</strong> – Includes illegally exploited copyrighted works, commercial audio, video, or music files, and any material that violates any applicable law or regulation of any country, and anymaterial that is perceived to be misleading in any manner.</li>
    <li><strong>Warez</strong> – Includes, but is not limited to, pirated software, ROMS, emulators, phreaking, hacking, password cracking, IP spoofing and the like, and anything related to the above. It also includes any sites which provide "links to" or "how to" information about such material.</li>
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
The Customer agrees and undertakes that:
  <ol style="list-style-type: lower-roman;">
    <li>Any attempt to undermine or cause harm to any of the servers of CLOUD 4 INDIA is strictly prohibited. CLOUD 4 INDIA shall take no responsibility for the use of its clients' accounts by the Customer.</li>
    <li>In case of abuse of the resources provided by CLOUD 4 INDIA., in any way, CLOUD 4 INDIA reserves the unqualified right to immediately deactivate the Customer's account, without refund.</li>
    <li>Denial of Service (DOS) attacks directed at CLOUD 4 INDIA., or any attempt to launch a DOS attack from CLOUD 4 INDIA servers are strictly prohibited. All infractions and or suspected infractions will be vigorously investigated and may result in immediate termination of Customer's account.</li>
    <li>In case the Customer is, in any way, disrespectful towards any member of CLOUD 4 INDIA or its staff, CLOUD 4 INDIA shall have full right to terminate Customer's account with it, without any refund.</li>
    <li>CLOUD 4 INDIA. will use reasonable efforts to protect and backup data for its clients / Customer on a regular basis, however, CLOUD 4 INDIA does not guarantee the existence, accuracy, or regularity of its backup services and, therefore, the Customer is solely responsible for making back-up files in connection with its use of the Services. Any back-up which CLOUD 4 INDIA may carry out will not include any media files which include (but are not limited to) mp3, mpeg, wmv or any other video/audio files.</li>
    <li>It shall be responsible for any misuse of its account and it must take steps to ensure that others do not gain unauthorized access to its account. It shall not use its account to breach the security of another account or attempt to gain un-authorised access to another network or server.</li>
    <li>Its password provides access to its account and it is responsible to keep its password secure.</li>
    <li>Sharing its password and account access with unauthorized users is strictly prohibited. It will take care and prevent others from using its account. It will be responsible for all consequences of others using its account.</li>
    <li>Attempting to obtain another user's account password is strictly prohibited, and will result in termination of Services.</li>
    <li>It shall adopt adequate security measures to prevent un-authorised use of its account.</li>
    <li>It shall not attempt to circumvent user authentication or security of any host, network or account which includes but is not limited to accessing data not intended for it, logging into or making use of a server or account. It is not expressly authorized to access, or probe the security of other networks. Use or distribution of tools designed for compromising security is prohibited. Such tools shall include but are not limited to password guessing programs, cracking tools or network probing tools.</li>
    <li>It shall not attempt to interfere with services provided to any user, host or network or carry out DOS attacks which includes but is not limited to "flooding" of networks, deliberate attempts to overload a service, and attempts to "crash" a host.</li>
    <li>Users who violate systems or network security may incur criminal or civil liability. CLOUD 4 INDIA will cooperate fully with investigations of violations of systems or network security at other sites, including cooperating with law enforcement authorities in the investigation of suspected criminal violations.</li>
    <li>It shall complete its own tests for computer viruses in accordance with best computing practice prior to each and every operational use of the Services</li>
  </ol>
</li>

<li><strong>Materials and Products</strong>
  <ol style="list-style-type: lower-roman;">
    <li>CLOUD 4 INDIA. shall exercise no control whatsoever over the content of the information passing through the network or on the Customer's websites.</li>
    <li>Use of any information obtained by way of CLOUD 4 INDIA is at the Customer's own risk, and CLOUD 4 INDIA specifically denies any responsibility for the accuracy or quality of information obtained through its services.</li>
    <li>Connection speed represents the speed of connection to CLOUD 4 INDIA and does not represent guarantees of available end to end bandwidth. CLOUD 4 INDIA can only guarantee within its controlled network, availability of bandwidth to Customer's subscribed Common Information Rate".</li>
  </ol>
</li>

<li><strong>CLOUD 4 INDIA</strong> is under no obligation to edit, review or modify the contents of the Customer's website. However, CLOUD 4 INDIA reserves the right to remove any content on the Customer's website without notice. For the avoidance of doubt, CLOUD 4 INDIA shall not pro-actively monitor messages that are posted on the sites managed by CLOUD 4 INDIA, but it reserves the right to remove such messages at its sole discretion, without notice to the Customer.</li>

<li>The Account of the Customer found to be using the Services for any of the purposes contained in Clause (IV) (i), above shall be terminated without any notice.</li>

<li>The first offense committed by the Customer in respect of Proxy as set out in Clause IV (iv), above will result in immediate suspension of their account. A second violation by Customer in this regard will result in immediate termination of its account.</li>

<li>Servers found to be (a) connecting to, or (b) part of another IRC network or server will be immediately removed from CLOUD 4 INDIA network, without notice. Such servers will not be reconnected to the network until such time that all traces of the IRC server are completely removed, and the Customer allows access to its server to confirm that the content has been completely removed.</li>

<li><strong>Indemnity</strong><br>
The Customer agrees that it shall fully and effectively defend, indemnify, save and hold
  <ol style="list-style-type: lower-roman;">
    <li>CLOUD 4 INDIA harmless from and all demands, liabilities, losses, costs, actions, proceedings, expenses (including legal expenses), liabilities and/or claims, howsoever suffered or incurred directly or indirectly by CLOUD 4 INDIA, its agents, officers and employees, that may arise or result from any acts or omissions of the Customer, its agents, employees or assigns (a) in connection with their use of the Services, and/or (b) as a consequence of the Customers breach or non-observance of its obligations set out in this AUP.</li>
    <li>The Customer shall defend and pay all costs, damages, awards, fees (including legal expenses) and judgments awarded against CLOUD 4 INDIA arising from breach or breaches of its obligations set out in this AUP. CLOUD 4 INDIA may in its absolute discretion defend such claims and may compromise such claims without the consent of the Customer. The Customer shall provide CLOUD 4 INDIA with the assistance necessary, or as required by CLOUD 4 INDIA, to defend such claims, at the Customer's sole expense.</li>
  </ol>
</li>

<li><strong>Amendment</strong><br>
Any amendment or modification of this AUP shall be effective only if it is in writing and duly signed by both the Parties.</li>
</ol>
`;

const eyebrow = 'Integrity';
const description = 'Review our Acceptable User Policy to understand the guidelines and responsibilities for using Cloud4India services. Ensure compliance with our terms for a secure and lawful hosting experience.';

console.log('🔄 Updating Acceptable User Policy content...');

db.run(
    'UPDATE integrity_pages SET content = ?, eyebrow = ?, description = ?, updated_at = datetime("now") WHERE slug = ?',
    [newAUPContent, eyebrow, description, 'acceptance-user-policy'],
    function (err) {
        if (err) {
            console.error('❌ Error updating AUP:', err.message);
        } else {
            console.log('✅ Acceptable User Policy content updated successfully!');
            console.log(`   Rows affected: ${this.changes}`);

            // Verify the update
            db.get(
                'SELECT id, slug, title, eyebrow, LENGTH(content) as content_length FROM integrity_pages WHERE slug = ?',
                ['acceptance-user-policy'],
                (err, row) => {
                    if (err) {
                        console.error('❌ Error verifying update:', err.message);
                    } else {
                        console.log('📋 Verification:');
                        console.log(`   ID: ${row.id}`);
                        console.log(`   Slug: ${row.slug}`);
                        console.log(`   Title: ${row.title}`);
                        console.log(`   Eyebrow: ${row.eyebrow}`);
                        console.log(`   Content length: ${row.content_length} characters`);
                    }
                    db.close();
                }
            );
        }
    }
);
