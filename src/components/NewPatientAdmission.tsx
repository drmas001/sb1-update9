import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Calendar, Clock, User, Users, Activity, X, FileText } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

interface PatientData {
  mrn: string;
  patient_name: string;
  age: number;
  gender: string;
  admission_date: string;
  shift_type: string;
  is_weekend_shift: boolean;
  assigned_doctor: string;
  specialty: string;
  diagnosis: string;
}

const specialtiesList = [
  'General Internal Medicine',
  'Respiratory Medicine',
  'Infectious Diseases',
  'Neurology',
  'Gastroenterology',
  'Rheumatology',
  'Hematology',
  'Thrombosis Medicine',
  'Immunology & Allergy',
  'Safety Admission'
];

const regularShifts = ['Morning', 'Evening', 'Night'];
const weekendShifts = ['Morning 12 hours', 'Night 12 hours'];

const NewPatientAdmission: React.FC = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<PatientData>({
    mrn: '',
    patient_name: '',
    age: 0,
    gender: '',
    admission_date: '',
    shift_type: '',
    is_weekend_shift: false,
    assigned_doctor: '',
    specialty: '',
    diagnosis: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPatientData({ ...patientData, [name]: checked, shift_type: '' });
    } else {
      setPatientData({ ...patientData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Insert into patients table
      const { data: patientInsert, error: patientError } = await supabase
        .from('patients')
        .insert([patientData])
        .select();

      if (patientError) throw patientError;

      // Insert into visits table
      const { data: visitInsert, error: visitError } = await supabase
        .from('visits')
        .insert([{
          mrn: patientData.mrn,
          admission_date: patientData.admission_date,
          specialty: patientData.specialty,
          patient_status: 'Active',
          diagnosis: patientData.diagnosis,
          shift_type: patientData.shift_type,
          is_weekend_shift: patientData.is_weekend_shift
        }]);

      if (visitError) throw visitError;

      toast.success('Patient admitted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to admit patient');
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">New Patient Admission</h1>
        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* MRN Input */}
                <div className="sm:col-span-3">
                  <label htmlFor="mrn" className="block text-sm font-medium text-gray-700">
                    MRN
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="mrn"
                      id="mrn"
                      value={patientData.mrn}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter MRN"
                    />
                  </div>
                </div>

                {/* Patient Name Input */}
                <div className="sm:col-span-3">
                  <label htmlFor="patient_name" className="block text-sm font-medium text-gray-700">
                    Patient Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="patient_name"
                      id="patient_name"
                      value={patientData.patient_name}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter patient name"
                    />
                  </div>
                </div>

                {/* Age Input */}
                <div className="sm:col-span-3">
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="age"
                      id="age"
                      value={patientData.age}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="150"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Gender Select */}
                <div className="sm:col-span-3">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <select
                      id="gender"
                      name="gender"
                      value={patientData.gender}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* Admission Date Input */}
                <div className="sm:col-span-3">
                  <label htmlFor="admission_date" className="block text-sm font-medium text-gray-700">
                    Admission Date
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="date"
                      name="admission_date"
                      id="admission_date"
                      value={patientData.admission_date}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Weekend Shift Checkbox */}
                <div className="sm:col-span-3">
                  <label htmlFor="is_weekend_shift" className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_weekend_shift"
                      name="is_weekend_shift"
                      checked={patientData.is_weekend_shift}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Weekend Shift</span>
                  </label>
                </div>

                {/* Shift Type Select */}
                <div className="sm:col-span-3">
                  <label htmlFor="shift_type" className="block text-sm font-medium text-gray-700">
                    Shift Type
                  </label>
                  <select
                    id="shift_type"
                    name="shift_type"
                    value={patientData.shift_type}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select shift type</option>
                    {patientData.is_weekend_shift
                      ? weekendShifts.map((shift) => (
                          <option key={shift} value={shift}>
                            {shift}
                          </option>
                        ))
                      : regularShifts.map((shift) => (
                          <option key={shift} value={shift}>
                            {shift}
                          </option>
                        ))}
                  </select>
                </div>

                {/* Assigned Doctor Input */}
                <div className="sm:col-span-3">
                  <label htmlFor="assigned_doctor" className="block text-sm font-medium text-gray-700">
                    Assigned Doctor
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="assigned_doctor"
                      id="assigned_doctor"
                      value={patientData.assigned_doctor}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter doctor's name"
                    />
                  </div>
                </div>

                {/* Specialty Select */}
                <div className="sm:col-span-3">
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                    Specialty
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Activity className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <select
                      id="specialty"
                      name="specialty"
                      value={patientData.specialty}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select specialty</option>
                      {specialtiesList.map((specialty) => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Diagnosis Textarea */}
                <div className="sm:col-span-6">
                  <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                    Diagnosis
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <textarea
                      id="diagnosis"
                      name="diagnosis"
                      rows={3}
                      value={patientData.diagnosis}
                      onChange={handleInputChange}
                      required
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter initial diagnosis"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Admit Patient
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPatientAdmission;