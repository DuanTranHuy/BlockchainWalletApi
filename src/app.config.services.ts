import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isTestnet(): boolean {
    return this.configService.get('TESTNET') === 'true';
  }
}