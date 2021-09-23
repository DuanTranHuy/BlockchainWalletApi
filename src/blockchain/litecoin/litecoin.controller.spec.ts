import { Test, TestingModule } from '@nestjs/testing';
import { LitecoinController } from './litecoin.controller';
import { LitecoinService } from './litecoin.service';

describe('LitecoinController', () => {
  let controller: LitecoinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LitecoinController],
      providers: [LitecoinService],
    }).compile();

    controller = module.get<LitecoinController>(LitecoinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
