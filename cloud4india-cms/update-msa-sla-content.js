/**
 * Update MSA & SLA page content
 * Based on the MSA_SLA.txt file content
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

const msaSlaContent = `
<h1>MSA & SLA</h1>

<h2>Master Service Agreement</h2>

<p>This Agreement is made and entered into on this __ day of _______ (Effective Date) by and between <strong>CLOUD 4 INDIA</strong> (hereinafter referred to as "C4INDIA"), a company incorporated under the Companies Act, 1956, and having its registered office at 3052 "Prestige Finsbury Park Hyde" Aerospace Park, Bagalur KIADB, Bengaluru, 562149 India having datacenter at H223, Rasoolpur, Sector 63, Noida, Uttar Pradesh 201301 and Plot No 13, Bakhtawarpur, Sector 127, Noida and CUSTOMER COMPANY (hereinafter referred to as the Customer), a company incorporated under the Companies Act, 1956/any other specify, and having its registered office at CUSTOMER ADDRESS</p>

<hr>

<h2>1. DEFINITIONS</h2>

<p>In this Agreement, the following words and expressions, unless inconsistent with the context, shall bear the meanings assigned thereto:</p>

<ol>
<li><strong>"Customer Area"</strong>: means the rack or any space provided by Service Provider to Customer where the server of Service Provider is located for the purpose of providing Services.</li>

<li><strong>"Customer Agreement Form (CAF)"</strong> means the form prescribed by C4INDIA, for provisioning of Services to the Customers and includes this MSA and SLA along with Annexure, as executed by the Customer.</li>

<li><strong>"Facility"</strong>: The facility is located at office of C4INDIA Datacenter in Uttar Pradesh where Service Provider provides space, racks for placing the servers.</li>

<li><strong>"Fees"</strong>: means the amount invoiced by Service Provider other than the Initial Term fees to be paid to by the Customer for use of services provided by Service Provider.</li>

<li><strong>"Master Service Agreement"</strong>: means the agreement which the Customer had acknowledged and agreed to the terms mentioned herein.</li>

<li><strong>"Network"</strong> means the portion internal computer network owned or operated on behalf of Service Provider that extends from the outbound port on a Customer's cabinet switch to the outbound port on the border router and includes all redundant internet connectivity, bandwidth, routers, cabling and switches.</li>

<li><strong>"Representatives"</strong> means any person who is nominated or appointed by the Customer to visit the Facility center.</li>

<li><strong>"Service Catalogue"</strong> shall contain all or any of services/facilities viz., back up facility, dedicated firewall facility, hardware monitoring facility, help desk support, load balance server, network and power uptime, OS management, shared firewall service and Version Control described in Annexure A to this SLA which may be availed by the Customer along with the Services as mentioned in the OF from Service Provider.</li>

<li><strong>"Service Outage"</strong> shall mean an unscheduled disruption/failure in any Service offered by Service Provider as per this Agreement, due to which Customer's server is un-accessible to Customer.</li>

<li>Customer is unable to transmit to or receive information from his network equipment because Service Provider failed to provide facility services to its network equipment including, switch, router, firewall etc. Failure of Services like Internet connectivity, IDC LAN etc. shall also be treated as Service Outage.</li>

<li><strong>"Space"</strong> The Portion of rack which is leased/licensed to Customer for placing their server.</li>

<li><strong>"Setup Charges"</strong> means all charges which may be incurred by C4INDIA for installing the server or any other expenses incurred for the commencement of Services to the Customer.</li>

<li><strong>"Support Desk"</strong> shall be the location where the Customer should report a fault. Details of the same are mentioned in annexure or if changed, may be intimated from time to time by Service Provider to the Customer.</li>

<li><strong>"Total Uptime Hours"</strong> shall mean 24 hours, 365 days a year. (Year is defined as period of 365 days) "Trouble Ticket" means issuing a ticket with a unique identification number confirming the customer complaint logging in with Service Provider in relation to a Service Outage faced by the Customer.</li>
</ol>

<hr>

<h2>2. Services</h2>
<p>C4INDIA will provide the service(s) as defined in ANNEXURE I.</p>

<hr>

<h2>3. Fees/Charges</h2>

<ol>
<li>Customer shall pay C4INDIA all fees/charges including monthly/quarterly/annual, as the case may be data transfer fees and excess usage fees, if any indicated on sales order ("Order") attached to as Annexure – II to this agreement. Customer acknowledges that in consideration of the discounted pricing set forth in the Order, if any, Customer commits to be liable for and pay the monthly fees set forth in an order for the term indicated in such order. (Including excess usage fees)</li>

<li>Customer shall be liable in case it utilizes bandwidth/data transfer in excess of what he has agreed for and shall reimburse C4INDIA for such excess usage per GB (as per the excess usage charges indicated in the proposal). Bandwidth/data transfer usage shall only be monitored through MRTG (a bandwidth monitoring software, info of which is available on www.mrtg.com) using Simple Network Management Protocol (SNMP) to measure data transferred. The reports obtained from MRTG will be final and binding on Customer.<br><br>
C4INDIA at its own discretion reserves the right to change the Bandwidth/data transfer usage-monitoring software an intimation of which shall be given to the Customer. Moreover, C4INDIA shall not be responsible for any excess/normal usage if the traffic generated is due to some malfunction of hardware, software or due to configurations done by the customer. The customer also agrees that it will be paying for the excess usages generated by any virus/Trojans, etc.</li>

<li>All payments shall be made by Cheque or Demand Draft drawn in favor of "C4INDIA" payable at Bengaluru, and it is to be sent to the address indicated in this Agreement or at such other address as C4INDIA may from time to time indicate by proper notice to customer. No Outstation Cheques shall be accepted. Customer shall pay payments in advance for the service period. C4INDIA shall raise invoice at least 15 days before the start of the period and send the same to the customer. All invoices shall be due and payable within fifteen (15) days of C4INDIA's date of invoice. Customer shall be liable to pay interest at the rate of one and half percent (2%) per month on all overdue and unpaid invoices.</li>

<li>Customer shall pay, indemnify and hold C4INDIA harmless from all sales, service, value-added or other taxes of any nature, other than taxes on C4INDIA's net income, including penalties and interest, and all government permit or license fees assessed upon or with respect to any fees (except to the extent Customer provides C4INDIA with a valid tax exemption certificate).</li>
</ol>

<hr>

<h2>4. Term</h2>
<p>The terms of this Agreement shall commence on the date of its execution by the Customer and shall be reviewed on an annual basis within the terms of this Agreement, and provided further, that with regard to any orders then outstanding, this Agreement shall continue to govern such Orders until such orders have been fully performed or terminated. The Agreement shall be deemed to be automatically renewed at the then current fees for additional periods, unless either party gives written notice otherwise to the other party, not less than thirty (30) days prior to the expiration of such order. This Agreement may be renewed for Additional Terms upon the mutual written consent of both parties.</p>

<hr>

<h2>5. Termination</h2>

<ol>
<li>Either party may terminate this Agreement or any order upon written notice: (a) for any material breach of this Agreement or any Order which the defaulting party fails to cure within fifteen (15) days following written notice by the non-defaulting party of such breach; or (b) upon either party's insolvency or liquidation as a result of which either party ceases to do business. Notwithstanding anything herein to the contrary, C4INDIA may terminate this Agreement or any Order without notice immediately for any breach under this Agreement.</li>

<li>Customer shall comply with all applicable procedures of C4INDIA related to equipment removal upon termination. In the event of any expiration or earlier termination of this Agreement or any Order, Customer will be obligated to pay to C4INDIA full contract period fees and charges unless such termination is the result of C4INDIA's default.<br><br>
In addition, if Customer fails to pay any invoice(s) for fifteen (15) days or more from the date of such invoice, C4INDIA shall deny access to the Space and the equipment of the customer placed with the C4INDIA shall not be released until such time till the invoice(s) has been paid in full.<br><br>
If the default continues for further 15 days, then C4INDIA shall be entitled to retain and sell the equipment of the customer placed with C4INDIA.</li>

<li>C4INDIA can terminate the services to the Customer in its sole discretion, if it is established that the Customer has used the service fraudulently, unlawfully or abusively.</li>

<li>On termination of Agreement, shall remove all of the Customer's electronically stored data from C4INDIA's facilities without liability of any kind to the Customer.</li>

<li>All provisions that by their nature are intended to survive any termination of this Agreement shall survive, including without limitation, Sections 2, 3, 4, 5, 6, 8, 9, 10 & 11 of the Agreement.</li>
</ol>

<hr>

<h2>6. Facilities</h2>

<ol>
<li><strong>License to Occupy</strong>: For purpose of this Agreement, "Space" means C4INDIA's premises where Customer's hardware, software and data are stored and operated, meaning thereby that C4INDIA grants to Customer a non-exclusive license to occupy the Space but Customer has not been granted any other right or interest in the Space.</li>

<li>Services shall not include services for problems arising out of: (a) modification, alteration or addition or attempted modification, alteration or addition of hardware undertaken by persons other than C4INDIA or C4INDIA's authorized representatives; or (b) hardware supplied by the Customer. C4INDIA shall not be responsible for the non-availability of the site and/or application due to any "bugs" or application failure.</li>

<li><strong>Material and Changes</strong>: Customer shall comply with all applicable rules and regulations, including equipment installation or de-installation, and alteration of the Space. Customer shall not make any changes to the interior or exterior portions of the Space, including any cabling or power supplies for its hardware.</li>

<li><strong>Damage</strong>: Customer agrees to reimburse C4INDIA for all reasonable repair or restoration costs associated with damage or destruction caused by Customer's personnel, Customer's agents, Customer's suppliers/contractors, or Customer's visitors during the term or as a consequence of Customer's removal of its hardware or property installed in the Space.</li>

<li><strong>Monitoring Equipment</strong>: C4INDIA shall install the monitoring equipment to monitor the bandwidth usage, service usage, etc. C4INDIA's liability in the event of loss to the customer due to activities which are not controllable by C4INDIA including without limitation, virus attack to the customer is NIL.</li>

<li><strong>Data Transfer</strong>: Data Transfer is used for the following traffic but not limited to: HTTP requests and response, incoming and outgoing email, mailing list distribution, both outbound and inbound data transfer from your account (network interface).</li>

<li><strong>Insurance</strong>: Unless otherwise agreed, Customer shall maintain at Customer's own expense, insurance covering equipment and personal property owned or leased by Customer and used or stored on C4INDIA's premises.</li>

<li><strong>Customers Duties</strong>: Customer shall document and promptly report all errors or malfunctions of the hardware to C4INDIA. Customer is responsible for the provisioning of all necessary spare parts and/or other hardware to maintain its servers. Customer shall maintain a current back up copy of all programs and data.</li>

<li><strong>Request of Service</strong>: Server On/Off by C4INDIA will not be done unless and until either it receives a written confirmation from the Customer or an email from its designated/responsible official.</li>

<li><strong>Regulations</strong>: Customer shall comply with all applicable operational rules and regulations while on C4INDIA's premises. Two (2) of the customer's employees or representatives can be named for the purpose of entering C4INDIA's space.</li>

<li><strong>Assumption of Risk</strong>: Customer hereby assumes any and all risks associated with Customer's, its agents' (including contractors and sub-contractors) or employees' use of the Space and shall indemnify, defend, and hold harmless C4INDIA from any and all claims, liabilities, judgments, causes of action, damages, costs and expenses.</li>

<li><strong>Prohibited items</strong>: Customers and its representatives shall keep the Customer Area clean at all times. Prohibited Material shall include, but are not limited to: Food & Drink, Tobacco products, Explosive and weapons, Hazardous materials, Alcohol, illegal drugs and other intoxicants, Electro-magnetic devices, Radioactive materials, Photographs or recording equipment of any kind.</li>

<li><strong>Online Conduct</strong>:
<p><strong>a. Customer content</strong>: Customer must acknowledge that C4INDIA exercises no control whatsoever over the content of the information passing through Customer's site(s).</p>
<p><strong>b. Prohibited activities</strong>: Customer will not permit any person using Customer's online facilities to: Send unsolicited commercial messages (SPAM), Engage in activities that infringe intellectual property rights, Violate personal privacy rights, Send harassing, abusive, libelous or obscene materials, Use the connectivity services for any illegal purpose.</p></li>

<li><strong>Third party complaint process</strong>: In the event C4INDIA receives complaints from third parties regarding prohibited activities, C4INDIA may take actions including First Complaint warning, Second Complaint with Rs. 5,500/- administrative charge, Third Complaint with service termination and Rs. 50,000/- charge.</li>

<li><strong>Customer Equipment</strong>: Each piece of equipment installed in the Customer Area must be clearly labeled with code name provided in writing to C4INDIA and individual component identification.</li>

<li><strong>Scheduled Maintenance</strong>: C4INDIA will conduct routine scheduled maintenance of its Internet Data Center Services according to the maintenance schedule posted on C4INDIA's World Wide Web sites.</li>

<li><strong>Support</strong>: C4INDIA gives the Customer round the clock support, monitoring, fault reporting and maintenance of the networks and systems at C4INDIA.</li>

<li><strong>Use of Material</strong>: As provided by national law and by international treaties, copyrighted materials shall not be uploaded using C4INDIA's Internet services without the permission of the copyright holder.</li>

<li><strong>Use of Internet Data Centre Facility</strong>: Customer and its representatives agree to adhere to and abide by all security and safety measures established by C4INDIA.</li>

<li><strong>Abuse of Service</strong>: Any use of C4INDIA system resource that disrupts the normal use of the system for other C4INDIA's Customers shall be considered to be abuse of system resources. A service re-activation charge of at least Rupees Ten Thousand (Rs.10,000) per server may be applied.</li>
</ol>

<hr>

<h2>7. Software License</h2>
<p>Software provided with the services is provided by third parties. All such third party provided software is licensed to Customer subject to terms and conditions of an End-User License Agreement ("EULA"). Customer agrees not to use any pirated software. C4INDIA shall not be responsible for any damages caused by third-party software.</p>

<hr>

<h2>8. Performance and Warranties</h2>

<ol>
<li>Each party represents and warrants that it has the right and authority to enter into this Agreement.</li>
<li>Customer represents and warrants that it will, at its own expense, make, obtain and maintain in force at all times during the term of this Agreement, all applicable filings, registrations, reports, licenses, permits and authorizations.</li>
<li>Both parties represent and warrant that they will comply with all laws, regulations and other legal requirements.</li>
<li>Customer represents and warrants that it will not utilize the services in a manner that is prohibited by any law or regulation.</li>
<li>THE WARRANTIES SET FORTH IN THIS CLAUSE ARE THE ONLY WARRANTIES MADE BY C4INDIA. C4INDIA IS PROVIDING SERVICES ON AN "AS IS", "AS AVAILABLE" BASIS.</li>
<li>C4INDIA warrants to Customer that the Services will be performed in a competent manner and substantially in accordance with any mutually agreed specifications.</li>
<li>The warranty does not apply to failures caused by associated products not supplied under the Agreement, Force Majeure events, or Third Party Materials.</li>
<li>C4INDIA shall not be liable for any loss of Customer Data while availing the Services unless Customer has opted for data backup along with data assurance services.</li>
<li>THE FOREGOING WARRANTIES ARE EXCLUSIVE AND IN LIEU OF ALL OTHER WARRANTIES, WHETHER WRITTEN, ORAL, IMPLIED OR STATUTORY.</li>
<li>C4INDIA does not provide any representation or warranty in respect of any products or services provided by others.</li>
</ol>

<hr>

<h2>9. Limitation of Liability</h2>
<p>In no event shall C4INDIA be liable for special, incidental, consequential damages of any nature, for any reason, including without limitation the breach of this Agreement or any termination of this Agreement.</p>
<p><strong>NOTWITHSTANDING ANYTHING IN THIS AGREEMENT TO THE CONTRARY, C4INDIA'S ENTIRE LIABILITY TO CUSTOMER SHALL NOT EXCEED THE AMOUNT RECEIVED BY C4INDIA FROM CUSTOMER DURING THE PREVIOUS TWELVE (12) MONTHS ONLY.</strong></p>

<hr>

<h2>10. Network Abuse</h2>
<p>Customer acknowledges that Customer has read and understands, and agrees to comply with, all applicable provisions of C4INDIA's Acceptable User policy.</p>
<ol>
<li>C4INDIA shall not be liable for any action taken to remove or restrict access to obscene, indecent or offensive content.</li>
<li>Customer agrees not to use any of C4INDIA's services to access or attempt to access other user's network without their express permission.</li>
<li>Customer agrees to defend, indemnify and hold harmless C4INDIA from any claims arising out of Customer's use of the services.</li>
<li>Violations of any of the C4INDIA conditions of use are unethical and may be deemed criminal offences.</li>
</ol>

<hr>

<h2>11. Confidential Information</h2>
<ol>
<li>Each party agrees to maintain all Confidential Information of the other party in confidence to the same extent that it protects its own similar Confidential Information. The foregoing restrictions on disclosure and use shall survive for two (2) years following termination of this Agreement.</li>
<li>Each of the parties agrees not to disclose to any third party the terms of this Agreement, including pricing, without the prior written consent of the other party.</li>
<li>In the event of an actual or threatened breach, the non-breaching party will be entitled to immediate injunctive and other equitable relief.</li>
<li>Within ten (10) days after the termination of this Agreement, Customer shall return to the disclosing party all originals and copies of all Confidential Information.</li>
</ol>

<hr>

<h2>12. Non-Assignment</h2>
<p>This Agreement shall be binding upon, and inure to the benefit of, the parties hereto and their respective successors and assigns. This Agreement may not be assigned without the written consent of the other party.</p>

<hr>

<h2>13. Independent Contractors</h2>
<p>The parties are independent contractors, and nothing in this Agreement shall be deemed to place the parties in the relationship of employer-employee, principal-agent, or partners or in a joint venture.</p>

<hr>

<h2>14. Non-Waiver</h2>
<p>Failure of either party to enforce any of its rights hereunder shall not be deemed to constitute a waiver of its future enforcement of such rights or any other rights.</p>

<hr>

<h2>15. Severability</h2>
<p>If any provision of this Agreement is held to be invalid, illegal or unenforceable under present or future laws, such provision shall be struck from the Agreement; however, such invalidity or enforceability shall not affect the remaining provisions or conditions of this Agreement.</p>

<hr>

<h2>16. Force Majeure</h2>
<p>Either party shall be excused from any delay or failure in performance hereunder caused by reason of any occurrence or contingency beyond its reasonable control, including but not limited to, acts of God, labor disputes, strikes, riots, war or other unanticipated occurrences or problems and governmental requirements.</p>

<hr>

<h2>17. Governing Law</h2>
<p>This Agreement shall be deemed to have been made in the Union of India and shall be governed by and interpreted in accordance with the law of the Union of India. Both parties agree to submit to the jurisdiction of National Capital Territory of Delhi.</p>

<hr>

<h2>18. Arbitration</h2>
<p>Any dispute or claim arising out of or in connection with this Agreement shall be finally settled by binding arbitration conducted in National Capital Territory of Delhi by an arbitrator appointed by the management of C4INDIA. The award of arbitration shall be binding and final.</p>

<hr>

<h2>19. Non-Agency</h2>
<p>Nothing contained in this Agreement shall be construed as creating any agency, partnership, or other form of joint enterprise between the parties.</p>

<hr>

<h2>20. Annexure</h2>
<p>All the Annexure form part of this Agreement and must be read along with this Agreement.</p>

<hr>

<h2>21. Heading</h2>
<p>Headings used in this Agreement are for reference purpose only and in no way define, limit, construe or describe the scope or extent of such clause.</p>

<hr>

<h2>22. Entirety</h2>
<p>This Agreement expresses the complete and final understanding of the parties with respect to the subject matter hereof, and supersedes all prior communications between the parties.</p>

<hr>

<h2>23. Notices</h2>
<p>Any required notices hereunder shall be given in writing by registered post or courier at the address of each party abovementioned. Notice shall be deemed served when delivered.</p>

<p>IN WITNESS WHEREOF, the undersigned do hereby execute this Agreement by duly authorized officials as of the date set forth below:</p>

<p><strong>For C4INDIA</strong><br>
PERSON NAME<br>
Authorized Signatory</p>

<hr>

<h1>Service Level Agreement ('SLA')</h1>

<p><strong>Service Hosting at C4INDIA's Data Centre</strong></p>

<p>This Agreement is effective from the Service Commencement Date as defined in Clause 1.1 (i) of the Agreement.</p>

<p>This Agreement provides the right under certain circumstances specified below, for a Customer to receive Service Credits in the event of failure by C4INDIA to provide Services to the Customer in accordance with the Agreement.</p>

<hr>

<h2>SLA DEFINITIONS</h2>

<p><strong>"Billing Start Date"</strong> shall mean the date of commissioning report submitted to the Customer by C4INDIA.</p>

<p><strong>"Downtime" ("D")</strong> shall mean the duration of the Service Outage, calculated in aggregate number of hours in respective month.</p>

<p><strong>"Exceptions"</strong> shall mean all the events as mentioned in Clause 3 of this SLA which shall not constitute a Service Outage or Downtime.</p>

<p><strong>"Emergency Maintenance"</strong> shall mean maintenance carried out under a condition or situation which poses danger to the system.</p>

<p><strong>"Actual Uptime" ("A")</strong> shall mean the aggregate percentage of Total Uptime Hours in respective month during which the Services is actually made available.</p>

<p><strong>"Service Credits"</strong> shall mean services which the Customer would be entitled on account of failure of C4INDIA to provide Services as per the standards.</p>

<p><strong>"Total Uptime Hours"</strong> shall mean 24 hours 365 days a year.</p>

<hr>

<h2>1. SCOPE OF THE SERVICES</h2>

<p>C4INDIA may provide such Services as provided in the Service Catalogue provided in Annexure A to this SLA.</p>

<p>C4INDIA assures Customer that it shall provide its immediate support and assistance in the event of any disruption in the Services.</p>

<p>Services will be provided to the Customer by C4INDIA with the infrastructure available at its data center which consists of:</p>
<ul>
<li>Dual active power sources from two different power generation plants.</li>
<li>Tier III – (system) + (system) Architecture – Fault Tolerant with No Single Point of Failure</li>
<li>Capability to provide 99.95 % SLA</li>
<li>Carrier Neutral Data center</li>
<li>ISO 20000-1 & 27001 Certified</li>
</ul>

<p>C4INDIA assures the Customer <strong>99.995% uptime</strong> availability of the Infrastructure viz., Power and Cooling covered by this SLA. Hardware Uptimes SLA would be 4 hours resolution from the time of detection of hardware problem.</p>

<p>C4INDIA assures Customer that it will provide cooling @ 21°C (+/-) 2°C and Humidity levels @ 50% (+/-) 5%.</p>

<h3>Service Credit Table</h3>
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

<p><strong>Calculation of Actual Uptime %</strong> = (Total Uptime Hours – Actual Downtime) / Total Uptime Hours x 100</p>

<hr>

<h2>2. EXCEPTIONS</h2>

<p>The following events do not constitute a Downtime and shall not be eligible for any Service Credit:</p>
<ol>
<li>Interruption due to scheduled maintenance (at least seven days prior notice) or Emergency Maintenance. Usual scheduled maintenance is between 1am to 6am.</li>
<li>The quarterly maintenance window.</li>
<li>Hardware failure</li>
<li>Failure of Customer links, internet connectivity or end user software not managed by C4INDIA.</li>
<li>DNS Issues not in scope and control of C4INDIA.</li>
<li>Negligence or other conduct of Customer or its authorized persons.</li>
<li>Shut down due to significant threat (hacker, virus attack, ransomware attack).</li>
<li>Force majeure events (natural disasters - flood, earthquake, etc.).</li>
<li>Data loss due to natural events or cyberattacks.</li>
<li>Failure of equipment or services not provided by C4INDIA; Abuse or fraud; Problems related to attacks such as hacking and exploits.</li>
</ol>

<hr>

<h2>3. SERVICE CREDIT</h2>
<p>C4INDIA agrees that it shall provide for the requisite service credits to the Customer in the event of not being able to provide the Services for which it had already received the payments.</p>
<p>Customer shall be eligible for Service Credit for only those Downtimes which has occurred a month prior to the date of claim.</p>

<hr>

<h2>4. PAYMENT TERMS</h2>
<p>The Customer shall pay all the charges as set out in the Agreement which includes one-time setup charges, recurring charges and other supplemental charges for any Supplemental Services provided.</p>

<hr>

<h2>5. PROCEDURE FOR AVAILING SERVICE CREDITS</h2>
<ul>
<li>The Customer should contact C4INDIA "Support Desk" without undue delay and shall request for a Trouble Ticket number.</li>
<li>C4INDIA shall verify if the Customer is eligible for the Service Credit.</li>
<li>C4INDIA shall credit the Customer's account the prorated base charges from the day the Trouble Ticket is issued till resolution.</li>
<li>Service Credits will be adjusted after end of existing contract by giving additional service Days.</li>
</ul>

<hr>

<h2>6. WARRANTIES OF C4INDIA</h2>
<p>C4INDIA warrants that it shall perform and provide Services in a professional and workmanlike manner in accordance with this Agreement.</p>

<hr>

<h2>7. REPRESENTATIONS OF CUSTOMER</h2>
<ol>
<li>The Customer will not do any voice communication from anywhere to anywhere by means of dialing a telephone number (PSTN/ISDN/PLMN).</li>
<li>The Customer will not establish any connection to any public switched Network (telephone voice network) in India.</li>
<li>Customer acknowledges and will not establish any interconnectivity between ISPs for Internet Telephony Services.</li>
</ol>

<hr>

<h2>8. NETWORK SECURITY</h2>
<p>For securing the servers of clients against any NW threats, the following are implemented: Firewall, IPS and Antivirus etc. Customer can opt for dedicated security gadgets by paying relevant charges.</p>

<hr>

<h2>9. MANAGING OS AND DB</h2>
<p>Setup and administering the OS, DB and HW including the patches updation for the servers will be taken care of by C4INDIA as and when required. OS is provided with license and accordingly charged.</p>

<hr>

<h2>10. SERVER AND DB MANAGEMENT</h2>
<p>OS and DB management will be provided by C4INDIA to the Customer, if opted for and charged accordingly.</p>

<hr>

<h2>11. CLIENT ACCESS TO THE SERVERS</h2>
<p>Customer is allowed to access their server only after providing the PO to C4INDIA. The Customer is provided with 1 IP and 24x7x365 monitoring of servers is maintained.</p>

<hr>

<h2>12. DISCLAIMER</h2>
<p>With a commitment to offer the best possible technology, C4INDIA shall upgrade its platform from time to time. C4INDIA reserves its right to change the platform without any change in the service levels committed.</p>

<hr>

<h2>Schedule A - TROUBLESHOOTING & RESOLUTION TIMES</h2>

<table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse: collapse;">
<tr style="background-color: #f3f4f6;">
<th>Priority</th>
<th>Priority Definition</th>
<th>Response Time (MTTA)</th>
<th>Resolution Time (MTTR)</th>
<th>Updates</th>
</tr>
<tr>
<td><strong>High</strong></td>
<td>Out of Service – N/W, Device Down, Power Down or Infrastructure down</td>
<td>15 minutes</td>
<td>8 Hours</td>
<td>1 Hour Interval</td>
</tr>
<tr>
<td><strong>Medium</strong></td>
<td>Partial/Intermittent Service Interruptions – System, N/W performance degraded but still functioning</td>
<td>30 minutes</td>
<td>24 Hours</td>
<td>4 Hour Interval</td>
</tr>
<tr>
<td><strong>Low</strong></td>
<td>All Change requests, Access Requests etc.</td>
<td>1 Hour</td>
<td>48 Hours</td>
<td>12 Hours</td>
</tr>
</table>

<p><strong>Notes:</strong></p>
<ul>
<li>Time starts when the problem is detected by C4INDIA Help Desk team or reported by the customer.</li>
<li>Resolution norms for different hardware problems will depend on the SLAs with respective vendors.</li>
<li>95% of the calls will be attended to within the stipulated response time – Measured quarterly.</li>
<li>90% of the calls will be closed within the stipulated resolution time – Measured quarterly.</li>
</ul>

<p><strong>In Case Of Outage</strong>: C4INDIA's IDC will communicate to Customer any outages related to Managed Services elements within 20 minutes of observation of fault.</p>

<hr>

<h2>Terms and Conditions</h2>
<p>C4INDIA reserves the right to modify the server manufacturer at any time. In the event that C4INDIA changes the server manufacturers, customers are assured that the specifications contracted will remain the same.</p>
`;

const eyebrow = 'Integrity';
const description = "Explore Cloud4India's Master Service Agreement (MSA) and Service Level Agreement (SLA) to understand our terms, commitments, and service standards.";

console.log('🔄 Updating MSA & SLA content...');

db.run(
    'UPDATE integrity_pages SET content = ?, eyebrow = ?, description = ?, updated_at = datetime("now") WHERE slug = ?',
    [msaSlaContent, eyebrow, description, 'msa-sla'],
    function (err) {
        if (err) {
            console.error('❌ Error updating MSA & SLA:', err.message);
        } else {
            console.log('✅ MSA & SLA content updated successfully!');
            console.log('   Rows affected: ' + this.changes);

            db.get(
                'SELECT id, slug, title, eyebrow, LENGTH(content) as content_length FROM integrity_pages WHERE slug = ?',
                ['msa-sla'],
                (err, row) => {
                    if (err) {
                        console.error('❌ Error verifying update:', err.message);
                    } else {
                        console.log('📋 Verification:');
                        console.log('   ID: ' + row.id);
                        console.log('   Slug: ' + row.slug);
                        console.log('   Title: ' + row.title);
                        console.log('   Eyebrow: ' + row.eyebrow);
                        console.log('   Content length: ' + row.content_length + ' characters');
                    }
                    db.close();
                }
            );
        }
    }
);
