import { View, Text, StyleSheet } from 'react-native'

export const PrivacyPolicy = () => {

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { textAlign: 'center' }]}>Privacy Policy for PokeVault</Text>
      <View>
        <Text style={styles.paragraph}>
          This privacy policy describes the procedures and policies for the usage, collection, and disclosure of your personal information when you use the services provided. This also tells you about your privacy rights and how the law protects you.

          Your personal information is used to improve this service and by using this service you agree to the collection and use of your information in accordance with this privacy policy.
        </Text>

        <View>
          <Text style={styles.title}>Personal Data</Text>
          <Text style={styles.paragraph}>While using this service, you may asked be to provide personally identifiable information that can be used to contact or identify you, the user. Personally identifiable information may be defined as your email address, name, phone number, and usage data. It is not limited to only these things.</Text>
        </View>

        <View>
          <Text style={styles.title}>Usage Data</Text>
          <Text style={styles.paragraph}>Usage data is collected automatically when using this service. It may include your device information, browser information, pages that you visit, time stamps, and other diagnostic data.</Text>
        </View>

        <View>
          <Text style={styles.title}>Usage of your personal data</Text>
          <Text style={styles.paragraph}>The company or owner may use your personal data to provide and maintain this service, manage your account, to contact you, for business transfers, and for data analysis.</Text>
        </View>

        <View>
          <Text style={styles.title}>Legal Requirement</Text>
          <Text style={styles.paragraph}>In certain situations, this service may be required to disclose your data to law enforcement or other legal obligations, to protect the organization that manages the service, and protect against legal liability.</Text>
        </View>

        <View>
          <Text style={styles.title}>Data Security</Text>
          <Text style={styles.paragraph}>The security of your data is important, and at this time your data is only stored locally on your device with future plans of securely storing it on cloud featurs. With this in mind, the organization operating this service cannot guarantee the absolute security of your data on your device or on future cloud services.</Text>
        </View>

        <View>
          <Text style={styles.title}>Changes to this privacy policy</Text>
          <Text style={styles.paragraph}>This privacy policy may be updated at any time. You, the user, will be notified of any changes. You may be notified via email or via notice on the service itself. You are also advised to review the privacy policy periodically for any changes. Changes to this privacy policy are effective when they are updated on this page.</Text>
        </View>

        <View>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.paragraph}>If you have any questions or concerns regarding this policy, you, the user, can contact us by email at sockgamefordays@gmail.com</Text>
        </View>
      </View>
    </View>
  )
}

// Stylesheet for this screen
const styles = StyleSheet.create({
  container: {
    padding: 4,
    marginBottom: 40
  },
  title: {
    marginVertical: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  paragraph: {
    fontSize: 18
  }
});