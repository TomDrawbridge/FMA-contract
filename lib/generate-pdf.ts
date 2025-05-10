import { jsPDF } from "jspdf"

interface ContractData {
  memberName: string
  guardianName: string
  signatureData: string
  date: string
}

export const generateContractPDF = async (data: ContractData): Promise<Blob> => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Add title
  doc.setFontSize(18)
  doc.text("FMA Membership Agreement", 105, 20, { align: "center" })

  // Add date
  doc.setFontSize(10)
  doc.text(`Date: ${data.date}`, 20, 30)

  // Add member and guardian info
  doc.setFontSize(12)
  doc.text(`Member Name: ${data.memberName}`, 20, 40)
  doc.text(`Guardian Name: ${data.guardianName}`, 20, 50)

  // Add contract text
  doc.setFontSize(10)
  doc.text("CONTRACT TERMS", 20, 70)

  const contractText = [
    "40. We cannot accept liability for loss or damage to you, your guest's or your child's personal property in the Academy or the car park, unless caused by our negligence, in which case our liability to you will be limited to the amount set out in paragraph 41. Vehicles parked within our car park are parked at the owner's risk and we take no responsibility for loss or damage, however caused.",
    "41. Our liability to pay you compensation for loss or damage (other than for death or personal injury) is limited to a reasonable amount, taking account of factors such as whether the loss or damage was due to our negligence. In any event, our maximum liability to you (other than for death or personal injury) will be an amount equal to six (6) months' Class Fees.",
    "42. We take no responsibility for any accident or injury incurred / sustained by you, your child, or your guests, through the making, drinking, carrying or spilling of any beverages at the Academy.",
    "43. We will be liable for death, personal injury or fraud where we are at fault or negligent.",
    "DATA PROTECTION",
    "44. We will keep any clinical information you give us confidential and secure and only pass it to, or receive it from, those involved with your child's programme or treatment. By joining the Academy and entering into this Agreement, you give us permission to process your child's personal data (including clinical information that relates to your child's health), as well as your personal data as your child's parent or legal guardian as is necessary to provide the services you have requested.",
    "45. It is important that we hold the most up-to-date contact details for you and your child. You are responsible for keeping all your and your child's personal contact details and choices for how you want to receive marketing materials up to date.",
    "46. We use CCTV at the Academy for insurance purposes. The CCTV footage is stored for a period of 4 weeks and is then automatically deleted. The CCTV footage is stored on a password protected system which is accessible only by FMA managers.",
    "CHOICE OF LAW",
    "47. Your child's membership, and this Agreement, with us is governed by the laws of England and Wales, and is subject to the exclusive jurisdiction of the courts of England and Wales.",
  ]

  let y = 75
  const lineHeight = 5
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const maxWidth = pageWidth - margin * 2

  contractText.forEach((paragraph) => {
    const lines = doc.splitTextToSize(paragraph, maxWidth)

    // Check if we need to add a new page
    if (y + lines.length * lineHeight > 270) {
      doc.addPage()
      y = 20
    }

    doc.text(lines, margin, y)
    y += lines.length * lineHeight + 3
  })

  // Add signature section
  doc.addPage()
  doc.setFontSize(12)
  doc.text("SIGNATURE", 20, 20)

  // Add signature image
  if (data.signatureData) {
    try {
      doc.addImage(data.signatureData, "PNG", 20, 30, 70, 30)
    } catch (error) {
      console.error("Error adding signature to PDF:", error)
    }
  }

  doc.text(`Signed by: ${data.guardianName}`, 20, 70)
  doc.text(`Date: ${data.date}`, 20, 80)
  doc.text("This is a legally binding document.", 20, 90)

  // Return the PDF as a blob
  return doc.output("blob")
}
