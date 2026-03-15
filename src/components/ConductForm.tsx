import React, { useState, useEffect } from 'react';
import { ConductEntry, ConductCategory } from '../types';
import { ClipboardCheck, Mail, AlertCircle, User, GraduationCap, FileText, ShieldCheck, Clock } from 'lucide-react';

const RECIPIENT_EMAIL = 'ignasi.tomas@escolaroserlesplanes.net';
const MAX_MAILTO_LENGTH = 2000;

export const ConductForm: React.FC = () => {
  const [formData, setFormData] = useState<ConductEntry>({
    timestamp: new Date().toISOString(),
    studentName: '',
    gradeGroup: '',
    category: '',
    description: '',
    measureAdopted: '',
    teacherName: '', // Could be pre-filled from auth context in a real app
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ConductEntry, string>>>({});
  const [uriLength, setUriLength] = useState(0);

  // Auto-update timestamp on mount
  useEffect(() => {
    setFormData(prev => ({ ...prev, timestamp: new Date().toISOString() }));
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ConductEntry, string>> = {};
    if (!formData.studentName) newErrors.studentName = 'El nombre del alumno es obligatorio';
    if (!formData.gradeGroup) newErrors.gradeGroup = 'El curso/grupo es obligatorio';
    if (!formData.category) newErrors.category = 'La categoría es obligatoria';
    if (!formData.description) newErrors.description = 'La descripción es obligatoria';
    if (!formData.teacherName) newErrors.teacherName = 'El nombre del docente es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateMailtoUri = () => {
    const subject = `[CONDUCTA] - ${formData.category} - ${formData.studentName} - ${formData.gradeGroup}`;
    
    const body = [
      `FECHA/HORA: ${formData.timestamp}`,
      `ALUMNO: ${formData.studentName}`,
      `CURSO/GRUPO: ${formData.gradeGroup}`,
      `CATEGORÍA: ${formData.category}`,
      `DOCENTE: ${formData.teacherName}`,
      `------------------------------------------`,
      `DESCRIPCIÓN DEL HECHO:`,
      formData.description,
      `------------------------------------------`,
      `MEDIDA ADOPTADA:`,
      formData.measureAdopted || 'N/A'
    ].join('\r\n');

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    return `mailto:${RECIPIENT_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;
  };

  useEffect(() => {
    const uri = generateMailtoUri();
    setUriLength(uri.length);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const uri = generateMailtoUri();
      if (uri.length > MAX_MAILTO_LENGTH) {
        alert('El contenido es demasiado largo para enviarlo por email. Por favor, resume la descripción.');
        return;
      }
      window.location.href = uri;
    }
  };

  const inputClasses = "w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-700 placeholder:text-slate-400";
  const labelClasses = "flex items-center gap-2 text-sm font-semibold text-slate-600 mb-1.5";
  const errorClasses = "text-xs text-red-500 mt-1 flex items-center gap-1";

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="bg-indigo-600 px-6 py-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardCheck className="w-8 h-8" />
          <h2 className="text-2xl font-bold tracking-tight">Registro de Conducta</h2>
        </div>
        <p className="text-indigo-100 text-sm">Complete los campos para generar el informe institucional.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Row 1: Date & Teacher (Pre-filled/Automated) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>
              <Clock className="w-4 h-4" /> Fecha y Hora (Auto)
            </label>
            <input 
              type="text" 
              value={new Date(formData.timestamp).toLocaleString()} 
              readOnly 
              className={`${inputClasses} bg-slate-50 cursor-not-allowed`}
            />
          </div>
          <div>
            <label className={labelClasses}>
              <User className="w-4 h-4" /> Docente Informante
            </label>
            <input 
              type="text" 
              placeholder="Su nombre completo"
              value={formData.teacherName}
              onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
              className={`${inputClasses} ${errors.teacherName ? 'border-red-300' : ''}`}
            />
            {errors.teacherName && <p className={errorClasses}><AlertCircle className="w-3 h-3" /> {errors.teacherName}</p>}
          </div>
        </div>

        {/* Row 2: Student & Grade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>
              <User className="w-4 h-4" /> Identificador del Alumno
            </label>
            <input 
              type="text" 
              placeholder="Nombre y apellidos"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              className={`${inputClasses} ${errors.studentName ? 'border-red-300' : ''}`}
            />
            {errors.studentName && <p className={errorClasses}><AlertCircle className="w-3 h-3" /> {errors.studentName}</p>}
          </div>
          <div>
            <label className={labelClasses}>
              <GraduationCap className="w-4 h-4" /> Curso y Grupo
            </label>
            <select 
              value={formData.gradeGroup}
              onChange={(e) => setFormData({ ...formData, gradeGroup: e.target.value })}
              className={`${inputClasses} ${errors.gradeGroup ? 'border-red-300' : ''}`}
            >
              <option value="">Seleccione...</option>
              <option value="Infantil">Infantil</option>
              <option value="CI">CI</option>
              <option value="CM">CM</option>
              <option value="CS">CS</option>
              <option value="Grup A">Grup A</option>
              <option value="Grup B">Grup B</option>
            </select>
            {errors.gradeGroup && <p className={errorClasses}><AlertCircle className="w-3 h-3" /> {errors.gradeGroup}</p>}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className={labelClasses}>
            <ShieldCheck className="w-4 h-4" /> Categoría de Conducta
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.values(ConductCategory).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                  formData.category === cat 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {errors.category && <p className={errorClasses}><AlertCircle className="w-3 h-3" /> {errors.category}</p>}
        </div>

        {/* Description */}
        <div>
          <label className={labelClasses}>
            <FileText className="w-4 h-4" /> Descripción del Hecho
          </label>
          <textarea 
            rows={4}
            placeholder="Narrativa detallada de lo ocurrido..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`${inputClasses} resize-none ${errors.description ? 'border-red-300' : ''}`}
          />
          <div className="flex justify-between mt-1">
            {errors.description && <p className={errorClasses}><AlertCircle className="w-3 h-3" /> {errors.description}</p>}
            <p className={`text-[10px] ml-auto ${uriLength > MAX_MAILTO_LENGTH ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
              URI: {uriLength} / {MAX_MAILTO_LENGTH} caracteres
            </p>
          </div>
        </div>

        {/* Measure */}
        <div>
          <label className={labelClasses}>
            <ShieldCheck className="w-4 h-4" /> Medida Adoptada
          </label>
          <input 
            type="text" 
            placeholder="Acción correctiva o refuerzo aplicado"
            value={formData.measureAdopted}
            onChange={(e) => setFormData({ ...formData, measureAdopted: e.target.value })}
            className={inputClasses}
          />
        </div>

        <button
          type="submit"
          disabled={uriLength > MAX_MAILTO_LENGTH}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
            uriLength > MAX_MAILTO_LENGTH 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98]'
          }`}
        >
          <Mail className="w-5 h-5" />
          Enviar Registro vía Email
        </button>
      </form>

      <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest leading-relaxed">
          Diseño compatible con LMS & No-Code • Integración Institucional • v1.0
        </p>
      </div>
    </div>
  );
};
