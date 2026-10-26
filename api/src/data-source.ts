import 'reflect-metadata';import {DataSource} from 'typeorm';import{User,Product,Location,Stock,Movement}from './entities';import{Init1700000000000}from './migrations/1700000000000-Init';
export default new DataSource({type:'postgres',url:process.env.DATABASE_URL,entities:[User,Product,Location,Stock,Movement],migrations:[Init1700000000000],synchronize:false});
