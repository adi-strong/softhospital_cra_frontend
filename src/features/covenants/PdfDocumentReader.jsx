import {Page, Text, View, Document, pdf, StyleSheet} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
})

export const PdfDocumentReader = ({file}) => {
  return (
    <>
      <Document>
        <Page size='A4' style={styles.page}>
          <View style={styles.section}>
            <Text>Section #1</Text>
          </View>
          <View style={styles.section}>
            {pdf(file)}
          </View>
        </Page>
      </Document>
    </>
  )
}
