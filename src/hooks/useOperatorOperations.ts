import { useState } from "react";
import { toast } from "sonner";
import { ExtendedOperator, OPERATORS_STORAGE_KEY } from "@/types/operator";
import { fileToBase64, safeLocalStorage } from "@/utils/fileUtils";
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

export const useOperatorOperations = (
  operator: ExtendedOperator | null,
  setOperator: React.Dispatch<React.SetStateAction<ExtendedOperator | null>>,
  setImagePreviewUrls: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  contractType: string,
  ccnl: string,
  level: string,
  employmentType: string,
  jobType: string,
  startDate: Date | undefined,
  endDate: Date | undefined,
  grossSalary: string,
  netSalary: string,
  weeklyHours: string,
  normalHoursPercentage: string,
  workLocation: string,
  workSite: string,
  basePayAndContingency: string,
  edr: string,
  totalMonthlyCompensation: string,
  totalAnnualCompensation: string,
  contractSignDate: Date | undefined,
  contractClause: string,
  workingHoursClause: string,
  rebalancing: string,
  trainerName: string,
  trainingStartDate: Date | undefined,
  trainingEndDate: Date | undefined
) => {
  const [activeTab, setActiveTab] = useState("info");
  const [templateFile, setTemplateFile] = useState<File | null>(null);

  const handleChange = (field: keyof ExtendedOperator, value: any) => {
    if (!operator) return;
    
    setOperator({
      ...operator,
      [field]: value,
    });
  };
  
  const handleServiceToggle = (service: string) => {
    if (!operator) return;
    
    const updatedServices = [...(operator.service || [])];
    const index = updatedServices.indexOf(service as any);
    
    if (index >= 0) {
      updatedServices.splice(index, 1);
    } else {
      updatedServices.push(service as any);
    }
    
    handleChange("service", updatedServices);
  };
  
  const handleAvailabilityToggle = (availability: string) => {
    if (!operator) return;
    
    const updatedAvailability = [...(operator.availability || [])];
    const index = updatedAvailability.indexOf(availability as any);
    
    if (index >= 0) {
      updatedAvailability.splice(index, 1);
    } else {
      updatedAvailability.push(availability as any);
    }
    
    handleChange("availability", updatedAvailability);
  };
  
  const handleLanguageToggle = (language: string, type: 'fluent' | 'basic') => {
    if (!operator) return;
    
    const field = type === 'fluent' ? 'fluentLanguages' : 'basicLanguages';
    const currentLanguages = [...(operator[field] || [])];
    const index = currentLanguages.indexOf(language);
    
    if (index >= 0) {
      currentLanguages.splice(index, 1);
    } else {
      currentLanguages.push(language);
    }
    
    handleChange(field, currentLanguages);
  };
  
  const handleSizeToggle = (size: string) => {
    if (!operator) return;
    
    const updatedSizes = [...(operator.sizes || [])];
    const index = updatedSizes.indexOf(size);
    
    if (index >= 0) {
      updatedSizes.splice(index, 1);
    } else {
      updatedSizes.push(size);
    }
    
    handleChange("sizes", updatedSizes);
  };
  
  const handleFileUpload = async (field: keyof ExtendedOperator, fileNameField: keyof ExtendedOperator, file: File | null) => {
    if (!operator) return;
    
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        
        setOperator({
          ...operator,
          [field]: base64,
          [fileNameField]: file.name,
        });
        
        setImagePreviewUrls(prev => ({
          ...prev,
          [field]: base64
        }));
        
        console.log(`File ${file.name} convertito in base64 e memorizzato`);
      } catch (error) {
        console.error(`Errore nella conversione del file ${file.name}:`, error);
        toast.error(`Errore nel caricamento del file ${file.name}`);
      }
    } else {
      setOperator({
        ...operator,
        [field]: null,
        [fileNameField]: "",
      });
      
      setImagePreviewUrls(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[field as string];
        return newPreviews;
      });
    }
  };
  
  const handleSave = () => {
    if (!operator) return;
    
    try {
      const updatedOperator = {
        ...operator,
        contractData: {
          contractType,
          ccnl,
          level,
          employmentType,
          jobType,
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null,
          grossSalary,
          netSalary,
          weeklyHours,
          normalHoursPercentage,
          workLocation,
          workSite,
          basePayAndContingency,
          edr,
          totalMonthlyCompensation,
          totalAnnualCompensation,
          contractSignDate: contractSignDate ? contractSignDate.toISOString() : null,
          contractClause,
          workingHoursClause,
          rebalancing,
          trainerName,
          trainingStartDate: trainingStartDate ? trainingStartDate.toISOString() : null,
          trainingEndDate: trainingEndDate ? trainingEndDate.toISOString() : null
        }
      };
      
      const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
      if (!storedOperators) {
        toast.error("Errore nel salvataggio dell'operatore");
        return;
      }
      
      const operators = JSON.parse(storedOperators);
      const updatedOperators = operators.map((op: any) => 
        op.id === updatedOperator.id ? updatedOperator : op
      );
      
      safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(updatedOperators));
      setOperator(updatedOperator);
      toast.success("Profilo operatore aggiornato con successo");
    } catch (error) {
      console.error("Errore nel salvataggio dell'operatore:", error);
      toast.error("Errore nel salvataggio dell'operatore");
    }
  };

  const handleContractTemplateUpload = (file: File | null) => {
    setTemplateFile(file);
    if (file) {
      toast.success(`Template "${file.name}" caricato con successo`);
    }
  };

  const generateContract = async () => {
    if (!operator) return;

    try {
      if (templateFile) {
        const arrayBuffer = await templateFile.arrayBuffer();
        
        const data = {
          Nome: operator.name ? operator.name.split(' ')[0] : '',
          Cognome: operator.name ? operator.name.split(' ').slice(1).join(' ') : '',
          NomeCompleto: operator.name,
          CodiceFiscale: operator.fiscalCode,
          DataNascita: operator.birthDate,
          LuogoNascita: operator.birthCountry,
          Indirizzo: operator.address,
          CAP: operator.zipCode,
          Città: operator.residenceCity,
          Provincia: operator.province,
          
          TipoContratto: employmentType === 'indeterminato' ? 'Indeterminato' : 
                         employmentType === 'determinato' ? 'Determinato' : 
                         employmentType === 'a-chiamata' ? 'A Chiamata' : 'Prestazione Occasionale',
          TipoMansione: jobType === 'security' ? 'Security' :
                        jobType === 'doorman' ? 'Doorman' :
                        jobType === 'hostess-steward' ? 'Hostess/Steward' : 'Porterage',
          DataInizio: startDate ? startDate.toLocaleDateString('it-IT') : '',
          DataFine: endDate ? endDate.toLocaleDateString('it-IT') : 'indeterminato',
          CCNL: ccnl,
          Livello: level,
          RetribuzioneLorda: grossSalary,
          RetribuzioneNetta: netSalary,
          OreSettimanali: weeklyHours,
          PercentualeOrario: normalHoursPercentage,
          SedeLavoro: workLocation,
          LocationLavoro: workSite,
          PagaBaseContingenza: basePayAndContingency,
          EDR: edr,
          TotaleRetribuzioneMese: totalMonthlyCompensation,
          TotaleAnnuo: totalAnnualCompensation,
          DataFirmaContratto: contractSignDate ? contractSignDate.toLocaleDateString('it-IT') : '',
          DicituraContratto: contractClause,
          DicituraOrarioLavoro: workingHoursClause,
          Riproporzionamento: rebalancing,
          NominativoFormatore: trainerName,
          InizioFormazione: trainingStartDate ? trainingStartDate.toLocaleDateString('it-IT') : '',
          FineFormazione: trainingEndDate ? trainingEndDate.toLocaleDateString('it-IT') : '',
          
          IBAN: operator.iban,
          Banca: operator.bankName,
          
          DataOdierna: new Date().toLocaleDateString('it-IT'),
          
          Servizi: operator.service?.join(", ")
        };
        
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater();
        doc.loadZip(zip);
        doc.setData(data);
        doc.render();
        
        const generatedDocument = doc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        
        const fileName = `Contratto_${operator.name.replace(/\s+/g, '_')}_${contractType}.docx`;
        saveAs(generatedDocument, fileName);
        
        toast.success("Contratto generato con successo");
        handleSave();
      } else {
        const contractDate = new Date().toLocaleDateString('it-IT');
        
        let contractTypeText = "";
        switch (contractType) {
          case "full-time":
            contractTypeText = "CONTRATTO DI LAVORO A TEMPO PIENO";
            break;
          case "part-time":
            contractTypeText = "CONTRATTO DI LAVORO PART-TIME";
            break;
          case "a-chiamata":
            contractTypeText = "CONTRATTO DI LAVORO A CHIAMATA";
            break;
        }
        
        const contractText = `
${contractTypeText}

Data: ${contractDate}

TRA

Azienda [Nome Azienda], con sede legale in [Indirizzo Azienda], P.IVA [P.IVA Azienda], in persona del legale rappresentante pro tempore, di seguito denominata "Datore di Lavoro"

E

${operator.name}, nato/a a ${operator.birthCountry} il ${operator.birthDate}, residente in ${operator.address}, ${operator.zipCode}, ${operator.residenceCity}, ${operator.province}, Codice Fiscale: ${operator.fiscalCode}, di seguito denominato/a "Lavoratore"

SI CONVIENE E SI STIPULA QUANTO SEGUE:

1. OGGETTO DEL CONTRATTO
Il Datore di Lavoro assume il Lavoratore con la qualifica di Operatore di Eventi.

2. MANSIONI
Le mansioni affidate al Lavoratore sono le seguenti: ${operator.service?.join(", ")}

3. DURATA DEL CONTRATTO
Il presente contratto ha durata [determinata/indeterminata] con decorrenza dal [Data Inizio].

4. LUOGO DI LAVORO
La sede di lavoro è presso [Sede di Lavoro], fatta salva la possibilità per il Datore di Lavoro di inviare il Lavoratore presso altre sedi.

5. ORARIO DI LAVORO
${contractType === "full-time" ? 
  "L'orario di lavoro è fissato in 40 ore settimanali, articolate su 5 giorni lavorativi." : 
  contractType === "part-time" ? 
  "L'orario di lavoro è fissato in 20 ore settimanali, articolate secondo il seguente schema: [Dettagli Orario]." :
  "Il lavoratore si impegna a prestare la propria attività lavorativa quando richiesto dal Datore di Lavoro, con preavviso minimo di 24 ore."}

6. RETRIBUZIONE
La retribuzione lorda mensile è stabilita in Euro [Importo] e sarà corrisposta in rate mensili posticipate.
Coordinate bancarie per l'accredito: ${operator.bankName}, IBAN: ${operator.iban}

7. PERIODO DI PROVA
Le parti convengono che il periodo di prova è fissato in [Durata Periodo di Prova].

8. FERIE E PERMESSI
Il Lavoratore ha diritto a [Numero Giorni] giorni di ferie annuali retribuite.

9. RISOLUZIONE DEL CONTRATTO
Il presente contratto potrà essere risolto nei modi e nei casi previsti dalla legge e dal CCNL applicabile.

10. RINVIO
Per quanto non espressamente previsto dal presente contratto, si fa riferimento alle norme di legge e al CCNL applicabile.

Letto, confermato e sottoscritto.

[Luogo e Data]

Il Datore di Lavoro                                   Il Lavoratore
___________________                                   ___________________
`;

        const blob = new Blob([contractText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `Contratto_${operator.name.replace(/\s+/g, '_')}_${contractType}.txt`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 0);
        
        toast.success("Contratto generato con successo (formato testo)");
        handleSave();
      }
    } catch (error) {
      console.error("Errore nella generazione del contratto:", error);
      toast.error("Errore nella generazione del contratto");
    }
  };

  return {
    activeTab,
    setActiveTab,
    handleChange,
    handleServiceToggle,
    handleAvailabilityToggle,
    handleLanguageToggle,
    handleSizeToggle,
    handleFileUpload,
    handleSave,
    handleContractTemplateUpload,
    templateFile,
    generateContract
  };
};
