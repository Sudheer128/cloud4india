/**
 * Update Terms & Conditions - Add Sections 27-28
 * Based on uploaded images - content after section 26
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

// Complete content for sections 27-28
const additionalSections = `

<hr>

<h2>27. COMPLIANCE WITH CERT-IN DIRECTIONS</h2>

<p>The customer hereby agree and warrant to comply with the following directions contained in Cert In directions dated April 28, 2022 and produce the relevant records as when asked by the Company pursuant to any verbal or written order of a Government authority:-</p>

<p><strong>27.1</strong> customer agree to enable logs of all their ICT systems and maintain them securely for a rolling period of 180 days and the same shall be maintained within the Indian jurisdiction.</p>

<p><strong>27.2</strong> customer agree to maintain the following accurate information which must be maintained by them for a period of 5 years or longer duration as mandated by the law after any cancellation or withdrawal of the registration as the case may be in respect of the end-users of services provided by Cloud 4 India:-</p>
<ul>
<li>Validated names of subscribers/customers hiring the services</li>
<li>Period of hire including dates</li>
<li>IPs allotted to / being used by the members</li>
<li>Email address and IP address and time stamp used at the time of registration / on-boarding</li>
<li>Purpose for hiring services f. Validated address and contact numbers</li>
<li>Ownership pattern of the subscribers / customers hiring services</li>
</ul>

<hr>

<h2>28. OTHER OBLIGATIONS OF CUSTOMERS</h2>

<p><strong>28.1</strong> The customer shall provide the services only to the following type of users:-</p>
<ul>
<li><strong>End Users:</strong> End users shall mean those individuals or entities who are taking services for their own use and shall exclude customers who offer Cloud Infrastructure Services or similar services like WebHosting to their clients.</li>
<li><strong>Managed Service Providers (MSPs):</strong> The Customer can provide the services to MSPs who are not end users but manage infrastructure for their clients.</li>
</ul>

<p><strong>28.2</strong> Customers are not allowed to provide Cloud 4 India services/Infrastructure to any customer located outside India.</p>

<p><strong>28.3</strong> Customers shall ensure that all its end-users directly or indirectly using Cloud 4 India services are bound by Terms of Service similar to that of Cloud 4 India Terms of Services and that all provisions of Cloud 4 India Terms of Services are complied by all its end-users.</p>

<p><strong>28.4</strong> In case of any seizure of hardware provided by Cloud 4 India to customer by any Government Authority, for the purpose of an investigation against customer, its agents or End Users, or for any other purpose as per the requirement of the Government Authority, the customer shall be liable to pay, without any protest or demur, upfront the amount decided by Cloud 4 India, in its sole discretion, as:</p>
<ol style="list-style-type: lower-roman;">
<li>The cost of storage which is used by Cloud 4 India to provide requested data or information to the Government Authority, and</li>
<li>the cost of server or equipment seized by the Government Authority, and</li>
<li>the cost of effort made by Cloud 4 India professionals to arrange/provide the requested data including transportation cost if any.</li>
</ol>

<h3>28.5 Prohibited Activities/Workloads</h3>
<p>The customer agree and warrant that customer will ensure that Cloud 4 India infrastructure or services are not being used by any of its end-users for prohibited activities including but not limited to the following:-</p>
<ol style="list-style-type: lower-roman;">
<li>Crypto-currency</li>
<li>Adult sites</li>
<li>Chance based gaming</li>
<li>VOIP Solutions</li>
<li>UDP Based Gaming</li>
<li>Reseller Hosting</li>
<li>Use, provisioning or enablement of any software or techniques for anonymization specifically used to hide end-user real IP address for posting or publishing any content or performing any interactions with third parties where identification is generally required is prohibited including but not limited to use of VPN software like Open VPN, OpenVPN, proxy software, public VPNs, Tor nodes, torrent nodes etc.</li>
</ol>

<p>However, anonymization can be used on datastores where anonymization is specifically required to meet the requirements of the law</p>

<ol style="list-style-type: lower-roman;" start="16">
<li>Un-managed Shared Hosting</li>
</ol>

<p><strong>The above is not a comprehensive list of prohibited activities and all activities as prohibited by law or under Cloud 4 India Terms of Services shall be considered as prohibited activities for the purpose of this clause.</strong></p>
`;

console.log('🔄 Appending sections 27-28 to Terms & Conditions...');

db.get('SELECT content FROM integrity_pages WHERE slug = ?', ['terms'], (err, row) => {
    if (err) {
        console.error('❌ Error fetching content:', err.message);
        db.close();
        return;
    }

    if (!row) {
        console.error('❌ No row found with slug "terms"');
        db.close();
        return;
    }

    // Append the new sections to existing content
    const newContent = row.content + additionalSections;

    db.run(
        'UPDATE integrity_pages SET content = ?, updated_at = datetime("now") WHERE slug = ?',
        [newContent, 'terms'],
        function (err) {
            if (err) {
                console.error('❌ Error updating content:', err.message);
            } else {
                console.log('✅ Sections 27-28 added successfully!');
                console.log('   Rows affected: ' + this.changes);

                db.get(
                    'SELECT LENGTH(content) as content_length FROM integrity_pages WHERE slug = ?',
                    ['terms'],
                    (err, row) => {
                        if (err) {
                            console.error('❌ Error verifying:', err.message);
                        } else {
                            console.log('📋 New content length: ' + row.content_length + ' characters');
                        }
                        db.close();
                    }
                );
            }
        }
    );
});
