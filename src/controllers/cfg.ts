import Cfg, { ICfgModel } from '../models/cfg';

class CfgController {
  private idCfg: string;

  constructor() {
    this.idCfg = '';
    this.index = this.index.bind(this);
    this.setRemainingQueriesWS = this.setRemainingQueriesWS.bind(this);
  }

  public async index(): Promise<ICfgModel> {
    const cfgList = await Cfg.find();

    if (cfgList.length === 0) {
      const newCfg = await Cfg.create({ remainingQueriesWS: 0 });
      this.idCfg = newCfg._id;
      return newCfg;
    }

    this.idCfg = cfgList[0]._id;

    return cfgList[0];
  }

  public setRemainingQueriesWS(value: number): void {
    // Cfg.findOneAndUpdate(
    //   { _id: this.idCfg },
    //   { remainingQueriesWS: value },
    //   (err) => {
    //     if (err) {
    //       throw new Error('Erro ao atualizar!');
    //     }
    //   },
    // );

    Cfg.findById(this.idCfg, (_err, doc) => {
      if (doc) {
        const cfg = doc;
        cfg.remainingQueriesWS = value;
        cfg.save();
      }
    });
  }
}

export default new CfgController();
