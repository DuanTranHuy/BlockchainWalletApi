import { Test, TestingModule } from '@nestjs/testing';
import { LitecoinService } from './litecoin.service';

describe('LitecoinService', () => {
  let service: LitecoinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LitecoinService],
    }).compile();

    service = module.get<LitecoinService>(LitecoinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
