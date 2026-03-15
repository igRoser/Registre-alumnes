/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ConductCategory {
  POSITIVA = "Positiva",
  LEVE = "Leve",
  GRAVE = "Grave",
  MUY_GRAVE = "Muy Grave",
}

export interface ConductEntry {
  timestamp: string; // ISO 8601
  studentName: string;
  gradeGroup: string;
  category: ConductCategory | "";
  description: string;
  measureAdopted: string;
  teacherName: string;
}
