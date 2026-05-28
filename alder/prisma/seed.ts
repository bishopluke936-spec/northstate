import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create users
  const adminPassword = await bcrypt.hash('password123', 10)
  const advisorPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@northstate.com' },
    update: {},
    create: {
      email: 'admin@northstate.com',
      name: 'Sarah Mitchell',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const advisor = await prisma.user.upsert({
    where: { email: 'advisor@northstate.com' },
    update: {},
    create: {
      email: 'advisor@northstate.com',
      name: 'James Thornton',
      password: advisorPassword,
      role: 'ADVISOR',
    },
  })

  console.log('Users created:', admin.email, advisor.email)

  // Create communities
  const community1 = await prisma.community.upsert({
    where: { id: 'comm-001' },
    update: {},
    create: {
      id: 'comm-001',
      name: 'Chico Gardens Assisted Living',
      address: '2450 Cohasset Rd',
      city: 'Chico',
      state: 'CA',
      zip: '95926',
      contactPerson: 'Linda Pearson',
      phone: '(530) 891-4400',
      email: 'admissions@chicogardens.com',
      website: 'https://chicogardens.com',
      careLevels: 'INDEPENDENT,ASSISTED,MEMORY_CARE',
      pricingMin: 3200,
      pricingMax: 5800,
      availability: 'Good',
      referralAgreement: true,
      referralFeeType: 'FLAT',
      referralFeeAmount: 2000,
      notes: 'Excellent memory care unit. Strong referral relationship. Linda is responsive.',
    },
  })

  const community2 = await prisma.community.upsert({
    where: { id: 'comm-002' },
    update: {},
    create: {
      id: 'comm-002',
      name: 'Ridgeline Senior Living',
      address: '1200 Dana Dr',
      city: 'Redding',
      state: 'CA',
      zip: '96003',
      contactPerson: 'Mark Alvarez',
      phone: '(530) 222-1800',
      email: 'mark@ridgelinesenior.com',
      website: 'https://ridgelinesenior.com',
      careLevels: 'INDEPENDENT,ASSISTED',
      pricingMin: 2800,
      pricingMax: 4500,
      availability: 'Limited',
      referralAgreement: true,
      referralFeeType: 'PERCENT',
      referralFeeAmount: 75,
      notes: 'Nice independent living campus. Limited assisted living beds. Good for active seniors.',
    },
  })

  const community3 = await prisma.community.upsert({
    where: { id: 'comm-003' },
    update: {},
    create: {
      id: 'comm-003',
      name: 'Orchard View Memory Care',
      address: '890 Mangrove Ave',
      city: 'Chico',
      state: 'CA',
      zip: '95926',
      contactPerson: 'Patricia Hsu',
      phone: '(530) 895-2200',
      email: 'patricia@orchardviewmc.com',
      website: 'https://orchardviewmc.com',
      careLevels: 'MEMORY_CARE',
      pricingMin: 4500,
      pricingMax: 6500,
      availability: 'Good',
      referralAgreement: true,
      referralFeeType: 'FLAT',
      referralFeeAmount: 2500,
      notes: 'Specialized dementia and Alzheimer\'s care. Secured unit. Excellent staff-to-resident ratio.',
    },
  })

  const community4 = await prisma.community.upsert({
    where: { id: 'comm-004' },
    update: {},
    create: {
      id: 'comm-004',
      name: 'Paradise Pines Retirement',
      address: '445 Clark Rd',
      city: 'Paradise',
      state: 'CA',
      zip: '95969',
      contactPerson: 'David Chen',
      phone: '(530) 877-3100',
      email: 'dchen@paradisepines.com',
      website: 'https://paradisepines.com',
      careLevels: 'INDEPENDENT,ASSISTED,SKILLED_NURSING',
      pricingMin: 3000,
      pricingMax: 7200,
      availability: 'Good',
      referralAgreement: true,
      referralFeeType: 'FLAT',
      referralFeeAmount: 1800,
      notes: 'Full continuum of care. Great option for couples with different care needs. David is great to work with.',
    },
  })

  const community5 = await prisma.community.upsert({
    where: { id: 'comm-005' },
    update: {},
    create: {
      id: 'comm-005',
      name: 'Valley Oak Board & Care',
      address: '312 Manzanita Ave',
      city: 'Oroville',
      state: 'CA',
      zip: '95965',
      contactPerson: 'Rosa Gutierrez',
      phone: '(530) 533-7800',
      email: 'rosa@valleyoakcare.com',
      website: '',
      careLevels: 'ASSISTED,SKILLED_NURSING',
      pricingMin: 2400,
      pricingMax: 3800,
      availability: 'Good',
      referralAgreement: false,
      referralFeeType: '',
      referralFeeAmount: 0,
      notes: 'Small 6-bed RCFE. Very personal care. Good for seniors who need high-touch environment at lower cost.',
    },
  })

  console.log('Communities created')

  // Create leads
  const lead1 = await prisma.lead.upsert({
    where: { id: 'lead-001' },
    update: {},
    create: {
      id: 'lead-001',
      firstName: 'Dorothy',
      lastName: 'Hargrove',
      age: 84,
      phone: '(530) 342-5567',
      email: '',
      currentCity: 'Chico',
      preferredLocation: 'Chico or nearby',
      budgetMin: 3000,
      budgetMax: 5000,
      timeline: '1-2 months',
      status: 'TOURING',
      urgencyLevel: 'HIGH',
      notes: 'Daughter is primary contact. Dorothy has mild dementia and needs memory care. Recently had a fall at home.',
      careLevel: 'MEMORY_CARE,ASSISTED',
      mobility: 'Walker',
      medicationSupport: true,
      memoryDementia: true,
      fallRisk: true,
      behavioralConcerns: false,
      assignedToId: admin.id,
    },
  })

  const lead2 = await prisma.lead.upsert({
    where: { id: 'lead-002' },
    update: {},
    create: {
      id: 'lead-002',
      firstName: 'Robert',
      lastName: 'Andersen',
      age: 78,
      phone: '(530) 224-9900',
      email: 'randersen@gmail.com',
      currentCity: 'Redding',
      preferredLocation: 'Redding',
      budgetMin: 2500,
      budgetMax: 4000,
      timeline: '3-6 months',
      status: 'ASSESSING',
      urgencyLevel: 'MEDIUM',
      notes: 'Self-referred. Widower, looking for social environment. Mobile but has COPD.',
      careLevel: 'INDEPENDENT,ASSISTED',
      mobility: 'Independent',
      medicationSupport: true,
      memoryDementia: false,
      fallRisk: false,
      behavioralConcerns: false,
      assignedToId: advisor.id,
    },
  })

  const lead3 = await prisma.lead.upsert({
    where: { id: 'lead-003' },
    update: {},
    create: {
      id: 'lead-003',
      firstName: 'Eleanor',
      lastName: 'Vasquez',
      age: 91,
      phone: '(530) 566-2211',
      email: '',
      currentCity: 'Oroville',
      preferredLocation: 'Chico or Oroville',
      budgetMin: 2000,
      budgetMax: 3500,
      timeline: 'ASAP',
      status: 'REFERRED',
      urgencyLevel: 'URGENT',
      notes: 'Hospital discharge patient. Needs placement within 1 week. Son flew in from Texas to help.',
      careLevel: 'SKILLED_NURSING,ASSISTED',
      mobility: 'Wheelchair',
      medicationSupport: true,
      memoryDementia: false,
      fallRisk: true,
      behavioralConcerns: false,
      assignedToId: admin.id,
    },
  })

  const lead4 = await prisma.lead.upsert({
    where: { id: 'lead-004' },
    update: {},
    create: {
      id: 'lead-004',
      firstName: 'Harold',
      lastName: 'Kimura',
      age: 82,
      phone: '(530) 891-7745',
      email: 'hkimura@yahoo.com',
      currentCity: 'Chico',
      preferredLocation: 'Chico',
      budgetMin: 4000,
      budgetMax: 6500,
      timeline: '1 month',
      status: 'MOVED_IN',
      urgencyLevel: 'HIGH',
      notes: 'Placed at Chico Gardens. Move-in completed. Referral fee pending.',
      careLevel: 'MEMORY_CARE',
      mobility: 'Assisted',
      medicationSupport: true,
      memoryDementia: true,
      fallRisk: true,
      behavioralConcerns: true,
      assignedToId: admin.id,
    },
  })

  const lead5 = await prisma.lead.upsert({
    where: { id: 'lead-005' },
    update: {},
    create: {
      id: 'lead-005',
      firstName: 'Margaret',
      lastName: 'Sullivan',
      age: 76,
      phone: '(530) 345-0011',
      email: 'msullivan@comcast.net',
      currentCity: 'Chico',
      preferredLocation: 'Chico',
      budgetMin: 2800,
      budgetMax: 4200,
      timeline: '2-3 months',
      status: 'NEW_LEAD',
      urgencyLevel: 'LOW',
      notes: 'Referred by doctor. Early planning stage. Very independent. Wants to stay in Chico.',
      careLevel: 'INDEPENDENT',
      mobility: 'Independent',
      medicationSupport: false,
      memoryDementia: false,
      fallRisk: false,
      behavioralConcerns: false,
      assignedToId: advisor.id,
    },
  })

  const lead6 = await prisma.lead.upsert({
    where: { id: 'lead-006' },
    update: {},
    create: {
      id: 'lead-006',
      firstName: 'George',
      lastName: 'Whitfield',
      age: 89,
      phone: '(530) 222-3344',
      email: '',
      currentCity: 'Redding',
      preferredLocation: 'Redding or Chico',
      budgetMin: 3500,
      budgetMax: 5500,
      timeline: '1-2 months',
      status: 'LOST_CLOSED',
      urgencyLevel: 'MEDIUM',
      notes: 'Family decided to hire in-home care instead. May reconsider in 6 months.',
      careLevel: 'ASSISTED',
      mobility: 'Walker',
      medicationSupport: true,
      memoryDementia: false,
      fallRisk: false,
      behavioralConcerns: false,
      assignedToId: advisor.id,
    },
  })

  const lead7 = await prisma.lead.upsert({
    where: { id: 'lead-007' },
    update: {},
    create: {
      id: 'lead-007',
      firstName: 'Patricia',
      lastName: 'Nguyen',
      age: 80,
      phone: '(530) 877-5566',
      email: 'pnguyen@hotmail.com',
      currentCity: 'Paradise',
      preferredLocation: 'Paradise or Chico',
      budgetMin: 3000,
      budgetMax: 4500,
      timeline: '1 month',
      status: 'TOURING',
      urgencyLevel: 'HIGH',
      notes: 'Survivor of Camp Fire. Lost home. Daughter is very involved. Touring Paradise Pines this week.',
      careLevel: 'INDEPENDENT,ASSISTED',
      mobility: 'Cane',
      medicationSupport: true,
      memoryDementia: false,
      fallRisk: false,
      behavioralConcerns: false,
      assignedToId: admin.id,
    },
  })

  const lead8 = await prisma.lead.upsert({
    where: { id: 'lead-008' },
    update: {},
    create: {
      id: 'lead-008',
      firstName: 'James',
      lastName: 'Bradford',
      age: 73,
      phone: '(530) 533-9988',
      email: 'jbradford@gmail.com',
      currentCity: 'Oroville',
      preferredLocation: 'Oroville or Chico',
      budgetMin: 2200,
      budgetMax: 3800,
      timeline: '3-6 months',
      status: 'ASSESSING',
      urgencyLevel: 'MEDIUM',
      notes: 'Veteran. Exploring VA benefits to offset cost. Working with VA liaison.',
      careLevel: 'ASSISTED',
      mobility: 'Independent',
      medicationSupport: true,
      memoryDementia: false,
      fallRisk: false,
      behavioralConcerns: false,
      assignedToId: advisor.id,
    },
  })

  console.log('Leads created')

  // Family contacts
  await prisma.familyContact.createMany({
    data: [
      {
        leadId: lead1.id,
        name: 'Carol Hargrove',
        relationship: 'Daughter',
        phone: '(916) 441-2233',
        email: 'carol.hargrove@gmail.com',
        preferredContact: 'EMAIL',
        isPrimary: true,
      },
      {
        leadId: lead1.id,
        name: 'Tom Hargrove',
        relationship: 'Son',
        phone: '(530) 891-6644',
        email: '',
        preferredContact: 'PHONE',
        isPrimary: false,
      },
      {
        leadId: lead2.id,
        name: 'Lisa Andersen',
        relationship: 'Daughter',
        phone: '(530) 221-8877',
        email: 'lisa.andersen@email.com',
        preferredContact: 'PHONE',
        isPrimary: true,
      },
      {
        leadId: lead3.id,
        name: 'Carlos Vasquez',
        relationship: 'Son',
        phone: '(512) 555-0123',
        email: 'cvasquez@gmail.com',
        preferredContact: 'EMAIL',
        isPrimary: true,
      },
      {
        leadId: lead4.id,
        name: 'Susan Kimura',
        relationship: 'Daughter',
        phone: '(530) 342-1122',
        email: 'skimura@yahoo.com',
        preferredContact: 'PHONE',
        isPrimary: true,
      },
      {
        leadId: lead5.id,
        name: 'Patrick Sullivan',
        relationship: 'Son',
        phone: '(530) 899-4433',
        email: 'psullivan@gmail.com',
        preferredContact: 'EMAIL',
        isPrimary: true,
      },
      {
        leadId: lead7.id,
        name: 'Amy Nguyen',
        relationship: 'Daughter',
        phone: '(530) 877-1100',
        email: 'amy.nguyen@gmail.com',
        preferredContact: 'PHONE',
        isPrimary: true,
      },
      {
        leadId: lead8.id,
        name: 'Michael Bradford',
        relationship: 'Son',
        phone: '(530) 534-7788',
        email: 'mbradford@gmail.com',
        preferredContact: 'EMAIL',
        isPrimary: true,
      },
    ],
    skipDuplicates: true,
  })

  console.log('Family contacts created')

  // Referrals
  const referral1 = await prisma.referral.upsert({
    where: { id: 'ref-001' },
    update: {},
    create: {
      id: 'ref-001',
      leadId: lead1.id,
      communityId: community1.id,
      referralDate: new Date('2024-11-01'),
      status: 'TOUR_SCHEDULED',
      tourDate: new Date('2024-11-08'),
      followUpDate: new Date('2024-11-10'),
      referralFeeStatus: 'PENDING',
      referralFeeAmount: 2000,
      notes: 'Tour confirmed with Linda for Thursday at 10am.',
    },
  })

  const referral2 = await prisma.referral.upsert({
    where: { id: 'ref-002' },
    update: {},
    create: {
      id: 'ref-002',
      leadId: lead1.id,
      communityId: community3.id,
      referralDate: new Date('2024-11-01'),
      status: 'SENT',
      followUpDate: new Date('2024-11-05'),
      referralFeeStatus: 'PENDING',
      referralFeeAmount: 2500,
      notes: 'Sent info packet. Waiting to hear back from Patricia.',
    },
  })

  const referral3 = await prisma.referral.upsert({
    where: { id: 'ref-003' },
    update: {},
    create: {
      id: 'ref-003',
      leadId: lead3.id,
      communityId: community5.id,
      referralDate: new Date('2024-10-28'),
      status: 'MOVED_IN',
      moveInDate: new Date('2024-10-30'),
      referralFeeStatus: 'INVOICED',
      referralFeeAmount: 0,
      notes: 'Emergency placement. No referral agreement in place but good relationship built.',
    },
  })

  const referral4 = await prisma.referral.upsert({
    where: { id: 'ref-004' },
    update: {},
    create: {
      id: 'ref-004',
      leadId: lead4.id,
      communityId: community1.id,
      referralDate: new Date('2024-10-10'),
      status: 'MOVED_IN',
      tourDate: new Date('2024-10-15'),
      moveInDate: new Date('2024-10-22'),
      referralFeeStatus: 'PENDING',
      referralFeeAmount: 2000,
      notes: 'Moved in successfully. Invoice being prepared.',
    },
  })

  const referral5 = await prisma.referral.upsert({
    where: { id: 'ref-005' },
    update: {},
    create: {
      id: 'ref-005',
      leadId: lead7.id,
      communityId: community4.id,
      referralDate: new Date('2024-11-02'),
      status: 'TOUR_SCHEDULED',
      tourDate: new Date('2024-11-07'),
      referralFeeStatus: 'PENDING',
      referralFeeAmount: 1800,
      notes: 'Amy is very interested in Paradise Pines. Tour set for Thursday.',
    },
  })

  console.log('Referrals created')

  // Communications
  await prisma.communication.createMany({
    data: [
      {
        leadId: lead1.id,
        type: 'CALL',
        date: new Date('2024-11-01T10:00:00'),
        summary: 'Initial call with Carol (daughter). Dorothy needs memory care ASAP. Carol is overwhelmed and looking for guidance. Explained our process and will send two options for tours.',
        nextStep: 'Schedule tours at Chico Gardens and Orchard View',
        followUpDate: new Date('2024-11-05'),
        followUpReminder: true,
      },
      {
        leadId: lead1.id,
        type: 'EMAIL',
        date: new Date('2024-11-02T09:30:00'),
        summary: 'Sent community comparison packet to Carol with info on Chico Gardens and Orchard View Memory Care. Included pricing, photos, and care level info.',
        nextStep: 'Call Carol to confirm tour dates',
        followUpDate: new Date('2024-11-04'),
        followUpReminder: true,
      },
      {
        leadId: lead1.id,
        type: 'CALL',
        date: new Date('2024-11-04T14:00:00'),
        summary: 'Called Carol. Tour at Chico Gardens confirmed for Nov 8. She liked the Orchard View info but wants to see Chico Gardens first due to price.',
        nextStep: 'Confirm tour with Linda at Chico Gardens',
        followUpDate: new Date('2024-11-08'),
        followUpReminder: true,
      },
      {
        leadId: lead2.id,
        type: 'CALL',
        date: new Date('2024-10-25T11:00:00'),
        summary: 'Robert called directly. Recently widowed, finding home too large. COPD managed with inhalers. Wants social activities, dining, and some personal care. Budget $2500-4000.',
        nextStep: 'Schedule assessment visit',
        followUpDate: new Date('2024-10-30'),
        followUpReminder: true,
      },
      {
        leadId: lead2.id,
        type: 'MEETING',
        date: new Date('2024-10-30T10:00:00'),
        summary: 'In-home assessment with Robert and daughter Lisa. Toured his current home. He is very mobile but needs medication management. Very social - loves cards and gardening.',
        nextStep: 'Research Ridgeline Senior Living - good fit for active lifestyle',
        followUpDate: new Date('2024-11-05'),
        followUpReminder: false,
      },
      {
        leadId: lead3.id,
        type: 'CALL',
        date: new Date('2024-10-28T16:00:00'),
        summary: 'Urgent call from hospital social worker at Enloe. Eleanor Vasquez needs discharge placement. Carlos (son) is flying in from Austin. Wheelchair-bound, needs skilled nursing initially.',
        nextStep: 'Call Valley Oak to check bed availability',
        followUpDate: new Date('2024-10-29'),
        followUpReminder: true,
      },
      {
        leadId: lead3.id,
        type: 'CALL',
        date: new Date('2024-10-29T09:00:00'),
        summary: 'Called Valley Oak - they have a bed available. Confirmed with Carlos. He will sign papers today. Move-in set for Oct 30.',
        nextStep: 'Follow up post-move-in on day 3',
        followUpDate: new Date('2024-11-02'),
        followUpReminder: true,
      },
      {
        leadId: lead4.id,
        type: 'CALL',
        date: new Date('2024-10-10T09:00:00'),
        summary: 'Initial call with Susan. Father Harold has advanced Alzheimer\'s, exhibiting wandering behaviors. Needs secured memory care. Budget up to $6500.',
        nextStep: 'Tour Chico Gardens memory care unit',
        followUpDate: new Date('2024-10-12'),
        followUpReminder: true,
      },
      {
        leadId: lead4.id,
        type: 'TOUR',
        date: new Date('2024-10-15T10:00:00'),
        summary: 'Tour at Chico Gardens with Susan and Harold. Harold responded well to the staff. Susan was impressed with the secured unit and staff-to-resident ratio. Ready to move forward.',
        nextStep: 'Complete move-in paperwork',
        followUpDate: new Date('2024-10-17'),
        followUpReminder: true,
      },
      {
        leadId: lead4.id,
        type: 'OTHER',
        date: new Date('2024-10-22T10:00:00'),
        summary: 'Move-in day. Harold settled in well. Staff very welcoming. Susan tearful but relieved. Good placement.',
        nextStep: 'Invoice community for referral fee. Follow up in 30 days.',
        followUpDate: new Date('2024-11-22'),
        followUpReminder: false,
      },
      {
        leadId: lead5.id,
        type: 'CALL',
        date: new Date('2024-11-01T13:00:00'),
        summary: 'Initial call with Margaret. Early planning stage. Healthy, active 76-year-old. Doctor suggested planning ahead. Wants to stay in Chico. Budget $2800-4200. Not urgently needed.',
        nextStep: 'Send information on independent living options in Chico',
        followUpDate: new Date('2024-11-15'),
        followUpReminder: false,
      },
      {
        leadId: lead7.id,
        type: 'CALL',
        date: new Date('2024-11-02T11:00:00'),
        summary: 'Initial call with Amy (daughter). Patricia lost home in Camp Fire, currently staying with Amy who lives in a small apartment. Needs affordable AL with activities. Looking at Paradise Pines.',
        nextStep: 'Schedule tour at Paradise Pines',
        followUpDate: new Date('2024-11-05'),
        followUpReminder: true,
      },
      {
        leadId: lead8.id,
        type: 'CALL',
        date: new Date('2024-10-31T14:00:00'),
        summary: 'Initial call with James himself. Veteran, has VA benefits but unsure how much they cover for assisted living. Mobile but needs help with medications and housekeeping.',
        nextStep: 'Connect with VA social worker to clarify Aid and Attendance benefit',
        followUpDate: new Date('2024-11-07'),
        followUpReminder: true,
      },
    ],
    skipDuplicates: true,
  })

  console.log('Communications created')
  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
