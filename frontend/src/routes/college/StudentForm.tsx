import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, StudentInput } from '../../schemas/student.schema';
import toast from 'react-hot-toast';

export default function StudentForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      enrollmentYear: new Date().getFullYear(),
      gender: 'male',
    }
  });

  const onSubmit = (data: StudentInput) => {
    toast.success(`Student ${data.name} submitted for APAAR verification!`);
    reset();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-6">
      <h1 className="text-xl font-bold text-slate-900 mb-1">Single Student APAAR Registration</h1>
      <p className="text-sm text-slate-500 mb-6">Submit individual record with real-time format and duplicate pre-checks</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Name</label>
            <input {...register('name')} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Rohan Sharma" />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">APAAR ID (12 Digits)</label>
            <input {...register('apaarId')} className="w-full px-3 py-2 border rounded-lg text-sm font-mono" placeholder="982345123490" />
            {errors.apaarId && <p className="text-xs text-rose-600 mt-1">{errors.apaarId.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Date of Birth</label>
            <input type="date" {...register('dateOfBirth')} className="w-full px-3 py-2 border rounded-lg text-sm" />
            {errors.dateOfBirth && <p className="text-xs text-rose-600 mt-1">{errors.dateOfBirth.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Gender</label>
            <select {...register('gender')} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Guardian Name</label>
            <input {...register('guardianName')} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Rajesh Sharma" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email</label>
            <input type="email" {...register('email')} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="student@srmeaswari.ac.in" />
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Contact Phone</label>
            <input {...register('contactPhone')} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="9876543210" />
            {errors.contactPhone && <p className="text-xs text-rose-600 mt-1">{errors.contactPhone.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Programme ID</label>
            <input {...register('programmeId')} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="BTECH-CSE-2024" />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t">
          <button type="button" onClick={() => reset()} className="px-4 py-2 border rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            Reset
          </button>
          <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm shadow">
            Submit Record
          </button>
        </div>
      </form>
    </div>
  );
}
