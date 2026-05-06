// Fallback sample data used when the Google Sheet cannot be fetched.
// Real data comes from the sheet via the Settings page sync.
export const SAMPLE_CLIENTS = [
  { id: 'c1', sr: 1, fileNo: 'ITR-001', name: 'Ramesh Kumar Gupta', group: 'Group A', inCharge: 'Rahul Sharma', pan: 'ABCPG1234A', dob: '1972-04-15', status: 'Call Made', date: '2024-09-10', remarks: 'PPF passbook not received' },
  { id: 'c2', sr: 2, fileNo: 'ITR-002', name: 'Sunita Agarwal', group: 'Group A', inCharge: 'Priya Mehta', pan: 'DEFSA5678B', dob: '1980-07-22', status: 'Detail Recd.', date: '2024-10-01', remarks: '' },
  { id: 'c3', sr: 3, fileNo: 'ITR-003', name: 'Mohan Lal Verma', group: 'Group B', inCharge: 'Rahul Sharma', pan: 'GHIMV9012C', dob: '1965-01-30', status: 'Bank entries done', date: '2024-10-15', remarks: 'Suspense entry for rent received' },
  { id: 'c4', sr: 4, fileNo: 'ITR-004', name: 'Anjali Sharma', group: 'Group B', inCharge: 'Amit Joshi', pan: 'JKLAS3456D', dob: '1990-11-05', status: 'Suspense informed', date: '2024-10-08', remarks: 'Suspense: salary mismatch' },
  { id: 'c5', sr: 5, fileNo: 'ITR-005', name: 'Vijay Prakash Mishra', group: 'Group C', inCharge: 'Sneha Patil', pan: 'MNOPM7890E', dob: '1958-06-18', status: 'Audit', date: '2024-10-20', remarks: '' },
  { id: 'c6', sr: 6, fileNo: 'ITR-006', name: 'Rekha Devi Tiwari', group: 'Group C', inCharge: 'Vikram Nair', pan: 'PQRDT2345F', dob: '1975-03-12', status: 'Ack Recd', date: '2024-10-25', remarks: '' },
  { id: 'c7', sr: 7, fileNo: 'ITR-007', name: 'Suresh Babu Nair', group: 'Group A', inCharge: 'Kavita Singh', pan: 'STUBN6789G', dob: '1969-09-28', status: 'Uploaded', date: '2024-10-28', remarks: '' },
  { id: 'c8', sr: 8, fileNo: 'ITR-008', name: 'Meera Krishnamurthy', group: 'Group D', inCharge: 'Rahul Sharma', pan: 'VWXMK1234H', dob: '1985-12-14', status: 'Call Made', date: '2024-08-15', remarks: 'No response for 3 weeks. Documents pending.' },
  { id: 'c9', sr: 9, fileNo: 'ITR-009', name: 'Ashok Ramesh Patel', group: 'Group D', inCharge: 'Priya Mehta', pan: 'YZAAP5678I', dob: '1978-05-07', status: 'Detail Recd.', date: '2024-10-12', remarks: '' },
  { id: 'c10', sr: 10, fileNo: 'ITR-010', name: 'Lalita Kumari Yadav', group: 'Group B', inCharge: 'Amit Joshi', pan: 'BCDAY9012J', dob: '1962-08-23', status: 'Closed', date: '2024-10-30', remarks: 'Filing not required' },
  { id: 'c11', sr: 11, fileNo: 'ITR-011', name: 'Deepak Narayan Joshi', group: 'Group C', inCharge: 'Sneha Patil', pan: 'EFGDJ3456K', dob: '1988-02-19', status: 'Call Made', date: '2022-11-01', remarks: 'Details pending since 2022' },
  { id: 'c12', sr: 12, fileNo: 'ITR-012', name: 'Priti Shah', group: 'Group A', inCharge: 'Vikram Nair', pan: 'HIJPS7890L', dob: '1970-10-31', status: 'Suspense informed', date: '2024-10-05', remarks: 'Suspense: unknown credit in bank' },
  { id: 'c13', sr: 13, fileNo: 'ITR-013', name: 'Ravi Shankar Dubey', group: 'Group D', inCharge: 'Kavita Singh', pan: 'KLMRD2345M', dob: '1955-04-03', status: 'N.A.', date: '2024-09-01', remarks: 'Deceased - case should be closed' },
  { id: 'c14', sr: 14, fileNo: 'ITR-014', name: 'Anita Bose', group: 'Group B', inCharge: 'Rahul Sharma', pan: 'NOPAB6789N', dob: '1982-07-16', status: 'Bank entries done', date: '2024-10-22', remarks: 'Capital gain entries pending verification' },
  { id: 'c15', sr: 15, fileNo: 'ITR-015', name: 'Kartik Iyer', group: 'Group C', inCharge: 'Priya Mehta', pan: 'QRSKI1234O', dob: '1995-01-08', status: 'Detail Recd.', date: '2024-10-18', remarks: '' },
];
