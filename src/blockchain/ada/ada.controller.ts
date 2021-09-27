import { Controller } from '@nestjs/common';
import { AdaService } from './ada.service';

@Controller('ada')
export class AdaController {
  constructor(private readonly adaService: AdaService) {}
}
