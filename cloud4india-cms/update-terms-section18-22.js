/**
 * Update Terms & Conditions - Complete Sections 18-22
 * Based on uploaded images for complete content
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

// Complete content for sections 18-22
const additionalSections = `
<hr>

<h2>18. SUSPENSION OF SERVICES</h2>

<p><strong>18.1</strong> We may, in our sole discretion, suspend the Services, in whole or in part, without liability if:</p>
<ol style="list-style-type: lower-roman;">
<li>you fail to pay the Fees/Charges due and payable to us by the due date or credit term mentioned in the invoice/reminder emails,</li>
<li>you are an Infra Credit Prepaid Customer and you run out of infra credits on your Customer Account,</li>
<li>you or your End User is in violation of these Terms and/or the Company Policies,</li>
<li>you fail to reasonably cooperate with our investigation of any suspected breaches of these Terms,</li>
<li>we reasonably believe that our cloud platform has been accessed or manipulated by a Third Party without your consent or our consent,</li>
<li>we reasonably believe that suspension of the Services is necessary to protect our environment generally,</li>
<li>you or your End User is in breach of provisions of Clause 8 and its sub-clauses,</li>
<li>we are obligated to suspend Services pursuant to a subpoena, court order or otherwise as required by Applicable Law or by an order of a Government Authority made in accordance with Applicable Law, whether in writing or by oral communication,</li>
<li>you or your End User's use of or access to the Services poses a security risk to us, the Services or to any Third-Party, or is fraudulent, and/or</li>
<li>you have ceased to operate in the ordinary course, or made an assignment for the benefit of creditors or effected a similar disposition of assets, or have become the subject of any insolvency, reorganization, liquidation or similar proceeding.</li>
</ol>

<p><strong>18.2</strong> If we are providing the servers, we may restrict access to Customer Data stored on our servers during any suspension of Services. We may, in our sole discretion, give you reasonable advance notice of a suspension under this Clause and a chance to cure the grounds on which the suspension is based, unless we determine, in our reasonable commercial judgment, that a suspension on shorter, contemporaneous or no notice is necessary to protect ourself or our other customers from operational, security, or other risks or if such suspension is ordered by a court or other judicial body of competent jurisdiction or a Government Authority.</p>

<p><strong>18.3</strong> In the event of any suspension of services pursuant to clause 18, Payments to be made for the reactivation of services shall, in addition to the outstanding amount of the invoice, include the following:</p>
<ul>
<li>Payment for invoices that are not due but have been raised and sent to you.</li>
<li>Any amount deducted by you in lieu of TDS for which you have not yet provided a signed TDS certificate/ documentary proof to our satisfaction.</li>
<li>Reactivation fees as determined by us at the discretion of Cloud 4 India.</li>
<li>Interest at the rate of one and half percent 2%) per month on all overdue and unpaid invoices, calculated on a day to day basis commencing from the due date of such payment until the date of actual receipt of the payment of the outstanding amount to us.</li>
</ul>

<p><strong>18.4</strong> You will remain responsible for all fees and charges that you have incurred till the date of De-Provisioning of Services irrespective of whether or not you have used the Services or even if the servers were in a suspended state.</p>

<p><strong>18.5</strong> At our sole discretion, we may disable your access to the Services, including your access to Customer Data as a consequence of the suspension of Services, and we will not be liable to you for any damages or losses, whether direct or indirect, that you may incur as a result of such suspension.</p>

<p><strong>18.6</strong> If you have multiple accounts, any suspension of Services pursuant to Clause 18.1 shall be grounds to suspend access to all customer accounts at our sole discretion. Further, if you have multiple accounts, then we will have the right to adjust outstanding payments not paid within due dates by you in respect of one Cloud 4 India account with credit balances lying in other Cloud 4 India accounts.</p>

<p><strong>18.7</strong> We shall have the right to suspend the Services being rendered to you after providing notice in this regard if we suspect that you/your Customer Account is linked in any manner with another customer account that has been suspended pursuant to the provisions of Clause 18.1.</p>

<p><strong>18.8</strong> In the event suspension of services is for the reasons specified in Clause 18.1, Cloud 4 India will not guarantee and will not be responsible/liable for the availability of the data and files of the Customer after such suspension. Cloud4India shall not be held liable for any loss of data, content or files of the Customer upon such suspension.</p>

<p><strong>18.9</strong> The Services once suspended by us due to non-payment of any outstanding dues by the due date mentioned on the invoice, shall be restored only when the outstanding payment is credited in our bank account. If you pay the outstanding balance or dues for the Services availed through an online payment gateway, payment shall be deemed to be made only on receipt of payment by us and its corresponding confirmation by the payment gateway. If we do not receive the payment and valid confirmation of payment duly made from the payment gateway, you will be required to pay the dues to avoid suspension/de-provisioning of Services or to revoke suspension of Services, as the case may be. You acknowledge that it may take upto 48 (Forty-Eight) hours for the Services to be reactivated properly post receipt of payment from you, where your access to the Services have been suspended.</p>

<p><strong>18.10 Consequences of deprovisioning of Services.</strong> Where the servers are provided by us, we reserve the right to De-Provision all or part of Services provided by Cloud 4 India including deprovisioning of committed instances, at any time after their suspension due to non-payment of outstanding dues and/or for other reasons pursuant to Clause 18.1.</p>

<p>It is hereby clarified that while suspending and/or de-provisioning services pursuant to reasons stated in clause 18.1, Cloud 4 India reserves the right to suspend/de-provision all services including but not limited to suspension/de-provisioning of committed instances/paid services. Further, no refund shall be due to the Customer in case de-provisioning is initiated by the Cloud 4 India pursuant to clause 18.</p>

<p>After De-Provisioning, the running subscribed services will be decommissioned, all of the Customer Data on servers including backups, if any, will be deleted and will no longer be available and resources allocated to you will be released.</p>

<p><strong>18.11 IN THE EVENT WE TAKE ANY ACTION PURSUANT TO THIS CLAUSE, WE SHALL HAVE NO LIABILITY TOWARDS YOU OR ANYONE CLAIMING BY OR THROUGH YOU. NOTHING HEREIN SHALL PRECLUDE YOU FROM PURSUING OTHER REMEDIES AVAILABLE BY STATUTE OR OTHERWISE PERMITTED BY APPLICABLE LAW.</strong></p>

<hr>

<h2>19. INDEMNIFICATION</h2>

<p><strong>19.1</strong> You shall defend, indemnify and hold harmless the Indemnified Parties, from and against any and all Claims and/or Losses arising out of or relating to:</p>
<ol style="list-style-type: lower-roman;">
<li>breach of these Terms by you, your representatives or End Users, or</li>
<li>violation of the Company Policies or Applicable Law by you, your representatives or End Users,</li>
<li>non-payment of applicable taxes including but not limited to GST, TDS or any other form of taxes levied by any Government Authority from time to time on you,</li>
<li>breach of security measures by you, your representatives or any End User,</li>
<li>a dispute between you and your End User,</li>
<li>alleged infringement of Third-Party IPRs by the Customer Data.</li>
</ol>

<p>Your obligation under this Clause 19.1 shall extend to Claims arising out of acts or omissions by your employees, End Users and any Person who gains access to the Services as a result of your failure to use reasonable security measures.</p>

<hr>

<h2>20. TERMINATION</h2>

<p><strong>20.1</strong> If you want to terminate/de-provision our Services, you should write to us a <a href="mailto:support@cloud4india.com">support@cloud4india.com</a> for manually provisioned services or in case of Services availed through Self Service Portal, you may terminate/de-provision the same by accessing your Customer Account at <a href="https://www.cloud4india.com">https://www.cloud4india.com</a></p>

<p><strong>20.2</strong> If you fail to make due payments on any invoice(s) raised by us as per the due dates mentioned on the invoice/reminder emails or if you fail to deposit the TDS to the appropriate Government Authority and fail to provide us a duly signed TDS certificate within statutory timelines, we retain the right to suspend and deprovision the Services.</p>

<p><strong>20.3</strong> We shall have the right to terminate your access to the Services at our sole discretion at any time, without any notice to you, if we are of the opinion that you have used the Services (a) fraudulently, unlawfully or abusively, (b) any such usage of the Services by you is in breach of Applicable Laws, (c) you have committed material breach of these Terms, or (d) for any reason whatsoever, if we are of the opinion that your use of the Services poses risk to us, our Services, our resources or other Cloud 4 India customers. Where your default is on the ground of violation of these Terms, we may, at our sole discretion, allow you an opportunity to cure your breach, and if you fail to cure such breach within such number of days as may be notified by us, <strong>or 30 (thirty) days (where it is not specified), we shall have the right to terminate the Services immediately.</strong></p>

<p><strong>20.4</strong> We may terminate the Services, at our sole discretion at any time, without any notice to you, if you have ceased to operate in the ordinary course of business, made an assignment for the benefit of creditors or effected a similar disposition of its assets, or have become the subject of any insolvency, reorganization, liquidation or similar proceeding.</p>

<h3>20.5 Effects of Termination</h3>
<ul>
<li>On termination of Services, we will remove all of your electronically stored data from our facilities, including all Customer Data and backups, if any, and this shall not give rise to any liability towards you.</li>
<li>If we are providing the servers, we reserve the right to re-format/delete/de-provision/remove any servers, virtual or physical, for freeing up resources for use by other Cloud 4 India customers.</li>
<li>You shall remain responsible for all fees and charges till the date of deprovisioning of respective services irrespective of whether you have used them or not.</li>
<li>You should immediately return or, if instructed by us in writing, destroy all Confidential Information pertaining to us, in your possession.</li>
<li>All provisions that by their nature are intended to survive any termination of Services shall survive.</li>
</ul>

<p><strong>20.6 Handover of data:</strong> Upon termination, we may at our sole discretion, assist you in transitioning Customer Data to an alternative technology or cloud service provider, for an additional charge and under separately agreed terms.</p>

<hr>

<h2>21. PROPRIETARY RIGHTS</h2>

<p>We or our licensors own all rights, title, and interest in and to the Services and underlying software, and all related technology and IPRs. Subject to these Terms, we grant you a limited, revocable, non-exclusive, non-sublicensable, non-transferrable license to access and use the Services. Further, you acknowledge that we will be required to use your logo, trademark and entity name for the limited purpose of identifying you in our records, marketing materials, the Website and client database. You hereby grant us permission to include your name, logos, and trademarks in our clientele, promotional and marketing materials and communications.</p>

<p>If you choose to provide input and suggestions regarding problems with or proposed modifications or improvements to the Websites and Services ("<strong>Feedback</strong>") then you hereby grant to us an unrestricted, perpetual, irrevocable, non-exclusive, fully-paid, royalty-free right to exploit the Feedback in any manner and for any purpose, including to improve the Website and Services and create other products and services.</p>

<hr>

<h2>22. COMPLIANCE WITH LAWS</h2>

<p>The customer shall comply with all applicable laws, regulations and guidelines issued by any Government Authority including but not limited to the ones issued by Ministry of Electronics and Information Technology ("Meity") and The Indian Computer Emergency Response Team ("CERT In") from time to time.</p>

<p>For the purpose of this agreement, "<strong>Government Authority</strong>" shall mean:</p>
<ol style="list-style-type: lower-alpha;">
<li>Indian government or foreign, federal, state, territorial or local which has jurisdiction over Cloud 4 India;</li>
<li>a department, office or minister of a government acting in that capacity; or</li>
<li>a commission, agency, board or other governmental, semi-governmental, judicial, quasi-judicial, administrative, monetary or fiscal authority, body or tribunal.</li>
</ol>

<p><strong>22.1</strong> The customer shall be governed by the following sections and in case of breach will be liable for the punishment accordingly:</p>

<h3>a) Information Technology (IT) Act, 2000:</h3>

<p><strong>6A. Delivery of services by service provider:</strong></p>
<ol>
<li>The appropriate Government may, for the purposes of this Chapter and for efficient delivery of services to the public through electronic means authorise, by order, any service provider to set up, maintain and upgrade the computerised facilities and perform such other services as it may specify, by notification in the Official Gazette.<br>
<em>Explanation:</em> For the purposes of this section, service provider so authorised includes any individual, private agency, private company, partnership firm, sole proprietor firm or any such other body or agency which has been granted permission by the appropriate Government to offer services through electronic means in accordance with the policy governing such service sector.</li>
<li>The appropriate Government may also authorise any service provider authorised under sub-section (1) to collect, retain and appropriate such service charges, as may be prescribed by the appropriate Government for the purpose of providing such services, from the person availing such service.</li>
<li>Subject to the provisions of sub-section (2), the appropriate Government may authorise the service providers to collect, retain and appropriate service charges under this section notwithstanding the fact that there is no express provision under the Act, rule, regulation or notification under which the service is provided to collect, retain and appropriate e-service charges by the service providers.</li>
<li>The appropriate Government shall, by notification in the Official Gazette, specify the scale of service charges which may be charged and collected by the service providers under this section: Provided that the appropriate Government may specify different scale of service charges for different types of services.</li>
</ol>

<ul>
<li><strong>Section 67:</strong> Deals with publishing or transmitting obscene material in electronic form. The punishment for the same amounts to imprisonment of either description for a term which may extend to three years and with fine which may extend to five lakh rupees and in the event of second or subsequent conviction with imprisonment of either description for a term which may extend to five years and also with a fine which may extend to ten lakh rupees.</li>
<li><strong>Section 67A:</strong> Pertains to publishing or transmitting sexually explicit material in electronic form. The punishment concerning such offence on first conviction amounts to imprisonment of either description for a term which may extend to five years and with fine which may extend to ten lakh rupees and in the event of second or subsequent conviction with imprisonment of either description for a term which may extend to seven years and also with fine which may extend to ten lakh rupees.</li>
<li><strong>Section 67B:</strong> Addresses the publishing or transmitting of material depicting children in sexually explicit acts in electronic form. An offender is liable for punishment on first conviction with imprisonment of either description for a term which may extend to five years and with fine which may extend to ten lakh rupees and in the event of second or subsequent conviction with imprisonment of either description for a term which may extend to seven years and also with fine which may extend to ten lakh rupees.</li>
<li><strong>Impersonation on the Platform:</strong> Prohibition of impersonating any person or entity or falsely claiming an affiliation with a person or entity. Whereby Section 419 IPC, 1860 deals with fraud such as committing the crime of password theft for impersonating and collecting data for personal benefit. According to this Section, "Whoever cheats by personation shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both."</li>
<li><strong>Data Breach or Hacking:</strong> Users are not allowed to attempt unauthorized access to other user accounts, manipulate the app's code, or engage in any form of hacking or data breach.<br>
Section 43 and Section 66 of the Information Technology Act, 2000 cover the civil and criminal offenses of data theft and hacking respectively. According to Section 66 of the IT Act, the following are the essentials for an offense to count as hacking:
<ol style="list-style-type: lower-roman;">
<li>There should be the malicious intention of the accused to tamper or break into the computer of the other person and steal or destroy its data or sources.</li>
<li>A wrongful act or damage to the data must be done according to the wrong intention.</li>
</ol>
</li>
</ul>

<h3>b) The Copyright Act, 1957</h3>

<ul>
<li><strong>Copyright Infringement:</strong> Customers must not upload, share, or create content that violates the copyrights, trademarks, or intellectual property rights of others. <strong>Section 51 of The Copyright Act, 1957</strong> specifies when a copyright is infringed. According to Section 51 of the Act, Copyright is deemed to be infringed if:
<ol style="list-style-type: lower-roman;">
<li>A person without obtaining the permission of the copyright holder does any act which only the copyright holder is authorized to do.</li>
<li>A person permits the place to be used for communication, selling, distribution or exhibition of an infringing work unless he was not aware or has no reason to believe that such permission will result in the violation of copyright.</li>
<li>A person imports infringing copies of a work</li>
<li>A person without obtaining the authority from the copyright holder reproduces his work in any form.</li>
</ol>
</li>
<li><strong>Section 63 of The Copyright Act, 1957</strong> shall be applicable in case of commission of such above-stated offense. Any person who knowingly infringes or abets the infringement of—(a) the copyright in a work, or (b) any other right conferred by this Act except the right conferred by section 53A, shall be punishable with imprisonment for a term which shall not be less than six months but which may extend to three years and with fine which shall not be less than fifty thousand rupees but which may extend to two lakh rupees.</li>
</ul>
`;

console.log('🔄 Fetching current Terms & Conditions content...');

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

    // Find and remove the incomplete section 18 and append the complete sections 18-22
    let currentContent = row.content;

    // Find where section 18 starts (remove the incomplete one)
    const section18Start = currentContent.indexOf('<h2>18. SUSPENSION OF SERVICES</h2>');

    if (section18Start !== -1) {
        // Remove everything from section 18 onwards
        currentContent = currentContent.substring(0, section18Start);
        // Remove trailing <hr> if present
        currentContent = currentContent.replace(/<hr>\s*$/, '');
    }

    // Append the complete sections 18-22
    const newContent = currentContent + additionalSections;

    console.log('🔄 Updating Terms & Conditions with complete sections 18-22...');

    db.run(
        'UPDATE integrity_pages SET content = ?, updated_at = datetime("now") WHERE slug = ?',
        [newContent, 'terms'],
        function (err) {
            if (err) {
                console.error('❌ Error updating content:', err.message);
            } else {
                console.log('✅ Sections 18-22 updated successfully!');
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
