import {MigrationInterface,QueryRunner} from 'typeorm';
export class Init1700000000000 implements MigrationInterface{
async up(q:QueryRunner){await q.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
await q.query(`CREATE TABLE users(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),username varchar UNIQUE NOT NULL,"passwordHash" varchar NOT NULL)`);
await q.query(`CREATE TABLE products(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),sku varchar UNIQUE NOT NULL,name varchar NOT NULL,unit varchar NOT NULL DEFAULT 'pcs')`);
await q.query(`CREATE TABLE locations(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),code varchar UNIQUE NOT NULL,description varchar NOT NULL DEFAULT '')`);
await q.query(`CREATE TABLE stock(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),"productId" uuid NOT NULL REFERENCES products(id),"locationId" uuid NOT NULL REFERENCES locations(id),quantity integer NOT NULL DEFAULT 0 CHECK(quantity>=0),UNIQUE("productId","locationId"))`);
await q.query(`CREATE TABLE movements(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),reference varchar UNIQUE NOT NULL,type varchar NOT NULL CHECK(type IN ('IN','OUT','TRANSFER')),"productId" uuid NOT NULL REFERENCES products(id),"fromLocationId" uuid REFERENCES locations(id),"toLocationId" uuid REFERENCES locations(id),quantity integer NOT NULL CHECK(quantity>0),"operatorId" uuid NOT NULL REFERENCES users(id),"createdAt" timestamptz NOT NULL DEFAULT now())`);}
async down(q:QueryRunner){for(const t of ['movements','stock','locations','products','users'])await q.query('DROP TABLE '+t)}
}
