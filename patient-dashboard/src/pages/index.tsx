import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { config } from "@/config/config";
import { ClinicsWithPatients } from "@/features/ClinicPatientDashboard/data/patientWithClinics/types";
import { ClinicPatientDashboard } from "@/features/ClinicPatientDashboard/ClinicPatientDashboard";
import { ClinicsWithPatientsInitialDataContext } from "@/features/ClinicPatientDashboard/data/patientWithClinics/initialData";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  initialClinicsWithPatients?: ClinicsWithPatients,
}

export async function getStaticProps() {
  const res = await fetch(`${config.clinicApiUrl}/clinicsWithPatients`)
  const initialClinicsWithPatients: ClinicsWithPatients = await res.json()
  return {
    props: { initialClinicsWithPatients },
    revalidate: config.staticDataRevalidationDelay
  }
}

export default function Home({ initialClinicsWithPatients }: Props) {
  return (
    <>
      <Head>
        <title>Patient Dashboard</title>
        <meta name="description" content="View patient info for specific clinics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>Patient Dashboard</h1>
        <ClinicsWithPatientsInitialDataContext.Provider value={initialClinicsWithPatients}>
          <ClinicPatientDashboard />
        </ClinicsWithPatientsInitialDataContext.Provider>
      </main>
    </>
  );
}

