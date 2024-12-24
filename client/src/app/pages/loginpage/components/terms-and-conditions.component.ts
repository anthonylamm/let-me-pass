import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [MatDialogModule],
  template: `
    <h2 mat-dialog-title>Terms and Conditions</h2>
    <mat-dialog-content>
      <h1>Security and Privacy Policy</h1>
      <p>Welcome to Let Me Pass Your security and privacy are our priorities. Please read this policy carefully to understand how we handle your data and ensure the safety of our platform.</p>
      <h2>1. Data Collection and Use</h2>
      <p>We collect minimal user data necessary to provide our services. This includes:</p>
      <ul>
          <li>Information you provide during signup (e.g., email address, username).</li>
          <li>Usage data to improve our services.</li>
      </ul>
      <p>We do not sell or share your personal information with third parties except as required by law.</p>

      <h2>2. Data Security</h2>
      <p>We implement industry-standard measures to protect your data, including:</p>
      <ul>
          <li>Secure storage using encryption.</li>
          <li>Regular security audits and updates.</li>
      </ul>
      <p>However, we <strong>do not guarantee</strong> that unauthorized access, hacking, or data breaches will never occur. <strong>Use this website at your own risk.</strong></p>

      <h2>3. Cookies</h2>
      <p>Our site uses cookies to enhance your experience. You can manage cookie preferences through your browser settings.</p>

      <h2>4. Third-Party Links</h2>
      <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of these websites.</p>

      <h2>5. Your Responsibilities</h2>
      <p>You are responsible for keeping your login credentials secure and reporting any suspicious activity to us immediately.</p>

      <h2>6. Changes to this Policy</h2>
      <p>We may update this policy periodically. Continued use of the website constitutes acceptance of any updates.</p>

      <hr>

      <h1>Acceptable Use Policy (AUP)</h1>

      <p>By using [Your Website Name], you agree to abide by the following guidelines:</p>

      <h2>1. Prohibited Activities</h2>
      <ul>
          <li>Do not engage in unlawful, abusive, or harmful behavior.</li>
          <li>Do not upload or distribute malware, viruses, or malicious software.</li>
          <li>Do not attempt to gain unauthorized access to the website or other user accounts.</li>
      </ul>

      <h2>2. User Responsibilities</h2>
      <ul>
          <li>Use the website for its intended purposes only.</li>
          <li>Respect the rights and privacy of other users.</li>
          <li>Report any violations or suspicious activities.</li>
      </ul>

      <h2>3. Enforcement</h2>
      <p>Violations of this policy may result in suspension or termination of your account and legal action where applicable.</p>

      <hr>

      <h1>DMCA Notice & Takedown Policy</h1>

      <p>We respect the intellectual property rights of others and comply with the Digital Millennium Copyright Act (DMCA). If you believe that your copyrighted material has been infringed upon, please submit a notice to us.</p>

      <h2>1. Filing a DMCA Notice</h2>
      <p>To file a DMCA notice, provide the following information:</p>
      <ul>
          <li>A description of the copyrighted material and where it is located on our website.</li>
          <li>Your contact information (name, address, email, and phone number).</li>
          <li>A statement that you have a good faith belief that the use is unauthorized.</li>
          <li>A statement that the information provided is accurate and you are authorized to act on behalf of the copyright owner.</li>
          <li>Your physical or electronic signature.</li>
      </ul>
      <p>Send DMCA notices to: <a href="mailto:lamanthony167@gmail.com">lamanthony167&#64;gmail.com</a></p>

      <h2>2. Takedown Process</h2>
      <p>Upon receiving a valid DMCA notice, we will:</p>
      <ul>
          <li>Remove or disable access to the infringing material.</li>
          <li>Notify the user who uploaded the material.</li>
      </ul>

      <h2>3. Counter-Notice</h2>
      <p>If you believe your content was removed in error, you may file a counter-notice with:</p>
      <ul>
          <li>Your contact information.</li>
          <li>A statement under penalty of perjury that the material was removed due to a mistake or misidentification.</li>
          <li>Your consent to jurisdiction in the applicable court.</li>
      </ul>
      <p>Send counter-notices to: <a href="mailto:lamanthony167@gmail.com">lamanthony167&#64;gmail.com</a></p>

      <hr>

      <h1>Disclaimer</h1>
      <p>Let Me Pass is <strong>not responsible for any data leaks</strong> or unauthorized access that may occur while using this website. Use this platform at your own risk.</p>

    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      max-height: 400px;
      overflow: auto;
    }
  `]
})
export class TermsAndConditionsComponent {}
