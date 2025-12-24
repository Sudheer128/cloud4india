/**
 * Update SLA section content in MSA & SLA page
 * Based on screenshots with complete SLA content
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

// First, get the current MSA content (we want to keep it and only update SLA part)
db.get('SELECT content FROM integrity_pages WHERE slug = ?', ['msa-sla'], (err, row) => {
    if (err) {
        console.error('Error fetching current content:', err.message);
        db.close();
        return;
    }

    // Extract MSA portion (everything before the SLA section)
    let currentContent = row.content;
    const slaStartIndex = currentContent.indexOf('<h1>Service Level Agreement');

    let msaContent = '';
    if (slaStartIndex !== -1) {
        msaContent = currentContent.substring(0, slaStartIndex);
    } else {
        msaContent = currentContent;
    }

    // New complete SLA content based on screenshots
    const newSlaContent = `
<h1>Service Level Agreement ('SLA')</h1>

<p><strong>Service Hosting at C4INDIA's Data Centre</strong></p>

<p>This Agreement is effective from the Service Commencement Date as defined in Clause 1.1 (i) of the Agreement</p>

<p>This Agreement provides the right under certain circumstances specified below, for a Customer to receive Service Credits in the event of failure by C4INDIA to provide Services to the Customer in accordance with the Agreement.</p>

<p>Customer acknowledges that C4INDIA has the expertise and knowledge to provide the Services. The Customer has shown his interest in availing the Services provided by Service Provider by accepting the terms and conditions mentioned in this Agreement and the standard of the Service as provided in this SLA.</p>

<hr>

<h2>DEFINITIONS</h2>

<p>In this SLA, the following words and expressions, unless inconsistent with the context, shall bear the meanings assigned thereto:</p>

<p><strong>"Billing Start Date"</strong> shall mean the date of commissioning report submitted to the Customer by C4INDIA. In case the Customer is not satisfied with the solution delivered by C4INDIA, the Customer shall inform C4INDIA of the same within 3 days of the receipt of Commissioning Date. Upon receipt of the objection, C4INDIA shall suspend all Services, make the changes required and release the environment once again with a new Commissioning Report. In such case the letter one shall be regarded as the Billing Start Date. If the Customer uses the commissioned set-up, though he has a few outstanding requests, Customer shall pay full charges from the first Commissioning Report, unless partial billing is agreed to between the parties, before the Customer starts using the Services. If no partial billing agreement has been reached and if Customer uses the Services even after raising objections, Customer shall pay in full from the first date of Commissioning Report.</p>

<p><strong>"Downtime" ("D")</strong> shall mean the duration of the Service Outage, calculated in aggregate number of hours in respective month. Where if C4INDIA identifies the service outage, the downtime begins from there on or if customer identifies and a Trouble Ticket is raised from the occurrence of Service Outage, the time period for Downtime begins upon start of Service Outage and ends when the Trouble Ticket is closed by C4INDIA subject to due confirmation from the Customer on resolution of the outage. The time periods are calculated on basis on the number of outages per respective month and excluding the events covered under headings Exceptions to this SLA which shall not for the purposes of this SLA be included while measuring Downtime.</p>

<p><strong>"Exceptions"</strong> shall mean all the events as mentioned in Clause 3 of this SLA and shall include either an event or a set of events, any occurrence and the duration of occurrence of which shall not constitute a Service Outage or Downtime for the purposes of this SLA.</p>

<p><strong>"Emergency Maintenance"</strong> shall mean maintenance carried out under a condition or situation which poses danger to the system, equipment, network, facilities required for rendering the Service etc. as the case may be and has to be attended immediately. C4INDIA shall try to notify the Customer about the emergency maintenance in advance, whenever feasible.</p>

<p><strong>"Facility"</strong> means the facility located at office of C4INDIA in Noida where C4INDIA provides space, racks for placing the servers.</p>

<p><strong>"Fees"</strong> means the amount invoiced by Service Provider.</p>

<p><strong>"Network"</strong> means the portion of internal computer network owned or operated on behalf of C4INDIA that extends from the outbound port on a Customer's cabinet switch to the outbound port on the border router and includes all redundant internet connectivity, bandwidth, routers, cabling and switches.</p>

<p><strong>"Actual Uptime" ("A")</strong> shall mean the aggregate percentage of Total Uptime Hours in respective month during which the Services is actually made available for use by Customer.</p>

<p><strong>"Representatives"</strong> means any person who is nominated or appointed by the Customer to visit the Facility center.</p>

<p><strong>"Service Credits"</strong> shall mean services which the Customer would be entitled on account of failure of the C4INDIA to provide Services as per the standards mentioned in this Agreement.</p>

<p><strong>"Service Catalogue"</strong> shall contain all or any of services/facilities viz., back up, dedicated firewall facility, hardware monitoring facility, help desk support, load balance server, network and power uptime, OS management, shared firewall service and Version Control described in Annexure A to this SLA which may be availed by the Customer.</p>

<p><strong>"Service Outage"</strong> shall mean an unscheduled disruption/failure in any Service offered by C4INDIA as per this Agreement, due to which Customer's server is un-accessible to Customer. The outage of Services due to, but not limited to the following shall be a Service Outage; Customer is unable to transmit to or receive information from his network equipment because C4INDIA failed to provide facility services to its network equipment including, switch, router, firewall etc. Failure of Services like Internet connectivity, IDC LAN etc. shall also be treated as Service Outage.</p>

<p><strong>"Setup Charges"</strong>: means all charges which may be incurred by C4INDIA for installing the server or any other expenses incurred for the commencement of Services to the Customer.</p>

<p><strong>"Support Desk"</strong> shall be the location where the Customer should report a fault. Details of the same are mentioned in Schedule B to this SLA, or if changed, may be intimated from time to time by C4INDIA to the Customer.</p>

<p><strong>"Total Uptime Hours"</strong> shall mean 24 hours 365 days a year (year is defined as period of 365 days)</p>

<p><strong>"Trouble Ticket"</strong> means issuing a ticket with a unique identification number confirming the Customer complaint logged in with C4INDIA in relation to a Service Outage faced by the Customer.</p>

<hr>

<h2>1. SCOPE OF THE SERVICES</h2>

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

<p>C4INDIA assures the Customer <strong>99.995 % uptime</strong> availability of the Infrastructure viz., Power and Cooling** covered by this SLA. Hardware Uptimes SLA would be 4 hours resolution from the time of detection of hardware problem either by C4INDIA help desk or by the Customer. Subject to Clause 3 of this SLA, in the event C4INDIA fails to provide the Customer with the Services required by the Customer in accordance with the SLA, such failure resulting from complete unavailability of C4INDIA network, such events will be treated as "Qualified Network Downtime Event" for which C4INDIA will issue the Customer a Service Credit – calculated as per method provided in Clause 2.5.</p>

<p>** C4INDIA assures Customer that it will provide cooling @ 21°C (+/-) 2°C and Humidity levels @ 50 % (+/-) 5%.</p>

<p>The Actual Uptime (A) calculated in the respective month and it will be measured (compared) against the total uptime hours of the year 99.995%. If the outages exceed total uptime hours the following service credits shall be due to Customer:</p>

<table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse: collapse;">
<tr style="background-color: #f3f4f6;">
<th>Uptime Level</th>
<th>Service Credit</th>
</tr>
<tr>
<td>A >= 99.995%</td>
<td>No Credits</td>
</tr>
<tr>
<td>A in between 99.994% to 99.000%</td>
<td>2 days equivalent service credit for the Service period affected calculated on a prorata basis.</td>
</tr>
<tr>
<td>A in between 98.999% to 98.000%</td>
<td>7 days equivalent service credit for the Service period affected calculated on a prorata basis.</td>
</tr>
<tr>
<td>A is < 98%</td>
<td>15 days equivalent service credit for the Service period affected calculated on a prorata basis</td>
</tr>
</table>

<p><strong>Calculation of Actual Uptime %</strong> = (Total Uptime Hours – Actual Downtime) / Total Uptime Hours x 100.</p>

<p>The Customer is required to provide a preventive maintenance window, once in every quarter to enable C4INDIA to update the various patches and carry out other preventive maintenance. The time required to carry out this preventive maintenance by C4INDIA shall depend upon the environment of the Customer and shall be informed to the Customer before the time window is sought. During this window, Customer's environment shall not be available and the same shall not be counted as Downtime.</p>

<p>For the customized solutions provided by C4INDIA, preventive maintenance is absolutely essential and the SLAs offered by C4INDIA are based on the explicit understanding that the Customer will provide opportunity for C4INDIA to carry out preventive maintenance from time to time. In case the Customer does not provide, at least once in a quarter, the requisite downtime to carry out preventive maintenance activities, even after a request is made by C4INDIA, C4INDIA shall not be liable to provide any Service Credits or any other compensation in case of Downtime or any other loss to Customer such as data loss, denial of service or virus attacks.</p>

<p>C4INDIA shall recommend usage of high availability architecture for all critical loads, wherein there is a duplication of critical elements. For instance, this may be two power sources to a rack, or two firewalls in the network. In a high availability set-up, it is clarified that even when one of the elements fail, but the other is still running, then the entire set-up/solution/system/environment is considered to be available and the same shall not be counted as Downtime.</p>

<hr>

<h2>2. EXCEPTIONS</h2>

<p>The following events do not constitute a Downtime and shall not be eligible to be considered for any Service Credit:</p>

<ol>
<li>Interruption due to scheduled maintenance, alteration, or implementation, where the Service Provider provides at least seven days prior notice and to the Customer and also interruption due to Emergency Maintenance; The usual scheduled maintenance time is the early hours of the morning i.e., between 1am to 6am. The usual maintenance time would not be more than two hours.</li>
<li>The quarterly maintenance window as described in clause 2.6 above.</li>
<li>Hardware failure</li>
<li>Failure of the Customer links, internet connectivity or end user software, access circuits, local loop or any network not owned or managed by C4INDIA.</li>
<li>DNS Issues not in scope and control of C4INDIA.</li>
<li>Negligence or other conduct of Customer or its authorized persons, including a failure or malfunction resulting from applications or services provided by Customer or its authorized persons;</li>
<li>A shut down due to circumstances reasonably believed by C4INDIA to be a significant threat to the normal operation of the Services, C4INDIA's facility, or access to or integrity of Customer data (e.g., hacker, virus attack, ransomware attack or such nature of interruptions)</li>
<li>Force majeure event which includes natural disaster i.e., flood, earthquake etc.</li>
<li>Data loss due to above mention natural events or cyberattacks</li>
<li>Failure or malfunction of any equipment or services not provided by C4INDIA;
<ul>
<li>Any abuse or fraud failure to comply with the Acceptable User Policy on the part of Customer and its authorized persons.</li>
<li>Any problems outside the Service Provider Facility Network.</li>
<li>Any interruptions, delays or failures caused by Customer or Customer's employees, agents, or subcontractors, such as, the following:
<ol style="list-style-type: lower-roman;">
<li>Inaccurate configuration.</li>
<li>Non-compliant use of any software installed on the server.</li>
<li>Customer initiated server over-utilization.</li>
</ol>
</li>
<li>Any problems related to the attacks on the machine such as hacking, attacks, and exploits.</li>
</ul>
</li>
</ol>

<hr>

<h2>3. SERVICE CREDIT</h2>

<p>C4INDIA agrees that it shall provide for the requisite service credits to the Customer in the event of it not being able to provide the Services for which it had already received the payments.</p>

<p>C4INDIA agrees that on occurrence of any event that attracts service credits the Customer would be eligible to request a Service Credit on compliance of the terms as mentioned in Clause 6.1. (a) of this SLA.</p>

<p>Customer shall be eligible for Service Credit for only those Downtimes which has occurred a month prior to the date of claim and the maximum Service Credit to which Customer shall be entitled is as mentioned in Clause 6.1.(c).</p>

<hr>

<h2>4. PAYMENT TERMS</h2>

<p>The Customer shall pay all the charges as set out in the Agreement which includes one-time setup charges, recurring charges and other supplemental charges for any Supplemental Services provided including before the Service Commencement Date.</p>

<hr>

<h2>5. PROCEDURE FOR AVAILING SERVICE CREDITS</h2>

<p>Whenever the Customer encounters Service Outage, the following procedure should be followed:</p>

<ul>
<li>The Customer should contact C4INDIA "Support Desk" without undue delay and shall request for a Trouble Ticket number immediately and can track the Trouble Ticket number till the Trouble Ticket is closed on resolution of the outage.</li>
<li>C4INDIA on the receipt of the issue of Trouble Ticket to the Customer shall have a background check to verify if the Customer is eligible for the Service Credit.</li>
<li>When C4INDIA fails to provide Services in accordance of the SLA entitling Customer for Service Credits, C4INDIA shall credit the Customer's account the prorated base charges from the day the Trouble Ticket is issued to Customer till the Trouble Ticket is closed on resolution of the outage.</li>
</ul>

<p>Service Credits will be adjusted after end of existing contract by giving additional service Days.</p>

<hr>

<h2>6. WARRANTIES OF C4INDIA</h2>

<p><strong>Additional Warranties of C4INDIA in regards to SLA:</strong></p>

<p>C4INDIA warrants that it shall perform and provide Services in a professional and workmanlike manner in accordance with this Agreement.</p>

<hr>

<h2>7. REPRESENTATIONS OF CUSTOMER</h2>

<p><strong>Additional Warranties of Customer in regards to SLA:</strong></p>

<ol>
<li>The Customer will not do any voice communication from anywhere to anywhere by means of dialing a telephone number (PSTN/ISDN/PLMN) as defined in National Numbering plan. The customer will not originate the voice communication service from a Telephone in India and/or terminate the voice communication to any Telephone within India.</li>
<li>The Customer will not establish any connection to any public switched Network (i.e. telephone voice network) in India and will not use any dial up lines with outward dialing facility from Nodes.</li>
<li>Customer acknowledges and will not establish any interconnectivity between ISPs for the purposes of offering Internet Telephony Services.</li>
</ol>

<hr>

<h2>8. NETWORK SECURITY</h2>

<p>For securing the servers of clients against any NW threats, the following are implemented: Firewall, IPS and Antivirus etc. However, Customer can opt for dedicated security gadgets by paying the relevant charges.</p>

<hr>

<h2>9. MANAGING OS AND DB</h2>

<p>Setup and administering the OS, DB and HW including the patches updation for the servers for OS and DB will be taken care of by C4INDIA as and when required. OS is provided with license and accordingly charged.</p>

<hr>

<h2>10. SERVER AND DB MANAGEMENT</h2>

<p>OS and DB management will be provided by C4INDIA to the Customer, if opted for and charged accordingly.</p>

<hr>

<h2>11. CLIENT ACCESS TO THE SERVERS</h2>

<p>Customer is allowed to access their server only after providing the PO to C4INDIA. The Customer is provided with 1 IP and 24x7x365 monitoring of servers is maintained.</p>

<hr>

<h2>12. DISCLAIMER</h2>

<p>With a commitment and desire to offer the best possible technology to the Customer and evolutions in technology, C4INDIA shall upgrade its platform from time to time. Accordingly, C4INDIA reserves its right to change the platform without any change in the service levels committed.</p>

<hr>

<h2>Schedule A to Annexure-1</h2>

<p>As mentioned in the Service Catalogue the following Services will be provided by C4INDIA. In the event there is a disruption in Service or alarm is triggered, the troubleshooting and resolution of the problem in respect of each Service, where applicable, shall be as follows:</p>

<h3>TROUBLESHOOTING & RESOLUTION TIMES</h3>

<table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse: collapse;">
<tr style="background-color: #f3f4f6;">
<th>Priority</th>
<th>Priority Definition</th>
<th>Mean Time to Assist (MTTA)/ Response Time</th>
<th>Mean Time to Repair (MTTR)/ Resolution Time</th>
<th>Updates</th>
</tr>
<tr>
<td><strong>High</strong></td>
<td>Out of Service – Eg: N/W, Device Down, Power Down or Infrastructure down at C4INDIA Datacenter Premises.</td>
<td>15 minutes*</td>
<td>8 Hours</td>
<td>1 Hour Interval</td>
</tr>
<tr>
<td><strong>Medium</strong></td>
<td>Partial/Intermittent Service Interruptions – Eg: System, N/W performance degraded but still functioning. (For services being provided by C4INDIA and inside its premises)</td>
<td>30 minutes*</td>
<td>24 Hours</td>
<td>4 Hour Interval</td>
</tr>
<tr>
<td><strong>Low</strong></td>
<td>All Change requests, Access Requests etc.</td>
<td>1 Hour*</td>
<td>48 Hours</td>
<td>12 Hours</td>
</tr>
</table>

<p><strong>Notes:</strong></p>
<ul>
<li>*Time starts when the problem is detected by C4INDIA Help Desk team or reported by the customer and ends on assistance/repair as applicable</li>
<li>Resolution norms for different hardware problems will depend on the SLAs with respective vendors</li>
<li>a. 95% of the calls will be attended to within the stipulated response time – Measured on a quarterly basis.</li>
<li>b. 90% of the calls will be closed within the stipulated resolution time – Measured on a quarterly basis</li>
<li>c. Resolution norms will not include WAN link</li>
</ul>

<p><strong>In Case Of Outage</strong>: C4INDIA's IDC will communicate to Customer any outages related to Managed Services elements within 20 minutes of observation of fault through NMS or escalation by its Engineers.</p>

<p>** Logging of complaint is mandatory to ensure that fault ticket number is generated for further reference & auto escalation through our work flow system.</p>

<hr>

<h2>DISCLAIMER</h2>

<p>C4INDIA will use reasonable efforts to resolve problems as quickly as possible. As C4INDIA offers this service based on a combination of third-party Hardware & Software, C4INDIA will not offer any service credits to the Customer in case of non-availability of his web site due to a problem with not having a redundant architecture in their set up. In such cases, C4INDIA will work with the customer to remedy problems at the earliest.</p>

<hr>

<h2>Terms and Conditions</h2>

<p>C4INDIA reserves the right to modify the server manufacturer at any time. In the event that C4INDIA changes the server manufacturers, customers are assured that the specifications contracted will remain the same. Please contact us for details pertaining to any other server configurations that might be available.</p>
`;

    // Combine MSA and new SLA content
    const fullContent = msaContent + newSlaContent;

    console.log('🔄 Updating SLA section content...');

    db.run(
        'UPDATE integrity_pages SET content = ?, updated_at = datetime("now") WHERE slug = ?',
        [fullContent, 'msa-sla'],
        function (err) {
            if (err) {
                console.error('❌ Error updating SLA section:', err.message);
            } else {
                console.log('✅ SLA section content updated successfully!');
                console.log('   Rows affected: ' + this.changes);

                db.get(
                    'SELECT id, slug, title, LENGTH(content) as content_length FROM integrity_pages WHERE slug = ?',
                    ['msa-sla'],
                    (err, row) => {
                        if (err) {
                            console.error('❌ Error verifying update:', err.message);
                        } else {
                            console.log('📋 Verification:');
                            console.log('   ID: ' + row.id);
                            console.log('   Slug: ' + row.slug);
                            console.log('   Title: ' + row.title);
                            console.log('   Content length: ' + row.content_length + ' characters');
                        }
                        db.close();
                    }
                );
            }
        }
    );
});
