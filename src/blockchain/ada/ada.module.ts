import { Module } from '@nestjs/common';
import { AdaService } from './ada.service';
import { AdaController } from './ada.controller';

@Module({
  controllers: [AdaController],
  providers: [AdaService]
})
export class AdaModule {}
