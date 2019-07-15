import { type SRAHandlerInterface, SRAHandler } from "./infraestructures/SRAHandler.mjs";
import { 
    type KernelInterface as SRAKernelInterface,
    Kernel as SRAKernel} from "../sra/kernel.mjs";
export interface KernelInterface {
    sraKernel: SRAKernelInterface;
    sraHandler: SRAHandlerInterface;
}
export class Kernel implements KernelInterface {
    sraKernel: SRAKernelInterface;
    sraHandler: SRAHandlerInterface;
    constructor(cookie: string) {
        this.sraKernel = new SRAKernel(cookie);
        this.sraHandler = new SRAHandler(this.sraKernel);
    }
}