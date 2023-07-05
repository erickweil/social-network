import {jest,describe,expect,test,afterAll} from "@jest/globals";
import { desconetarBanco } from "../src/config/dbConnect.js";

afterAll(async () => {
	await desconetarBanco();
});