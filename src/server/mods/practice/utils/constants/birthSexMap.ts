import { BirthSex } from '../../db/_types';

const birthSexMap = new Map([
  [BirthSex.m, 'Male'],
  [BirthSex.f, 'Female'],
  [BirthSex.u, 'Unknown'],
]);

export default birthSexMap;
