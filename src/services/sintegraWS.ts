import { Request, Response } from 'express';
import axios, { AxiosInstance } from 'axios';

import cfgController from '../controllers/cfg';

/*
url Teste
'https://www.sintegraws.com.br/api/v1/execute-api.php?token='+ TOKEN +'&cnpj=06990590000123&plugin=RF'

*/

interface IBaseSintegra {
  code: string;
  status: string;
  message: string;
}

interface ISintegraSaldo extends IBaseSintegra {
  qtd_consultas_disponiveis: string;
}

interface ISintegraSN extends IBaseSintegra {
  cnpj: string;
  cnpj_matriz: string;
  nome_empresarial: string;
  situacao_simples_nacional: string;
  situacao_simples_nacional_anterior: string;
}

interface ISintegraRFCnae {
  text: string;
  code: string;
}

interface ISintegraRF extends IBaseSintegra {
  data_situacao: string;
  complemento: string;
  nome: string;
  municipio: string;
  cep: string;
  uf: string;
  email: string;
  atividade_principal: ISintegraRFCnae;
  atividades_secundarias: ISintegraRFCnae[];
}

class SintegraWS {
  private api: AxiosInstance;

  private token: string;

  constructor() {
    this.token = process.env.SINTEGRA_API_KEY as string;
    this.api = axios.create({
      baseURL: 'https://www.sintegraws.com.br/api/v1/',
    });

    this.getRemainingQueriesWS = this.getRemainingQueriesWS.bind(this);
    this.setRemainingQueriesWS = this.setRemainingQueriesWS.bind(this);
  }

  private setRemainingQueriesWS(): void {
    this.api
      .get<ISintegraSaldo>('consulta-saldo.php', {
        params: { token: this.token },
      })
      .then((res) => {
        const remainingQueriesWS = Number(res.data.qtd_consultas_disponiveis);
        cfgController.setRemainingQueriesWS(remainingQueriesWS);
      });
  }

  public async getRemainingQueriesWS(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { remainingQueriesWS } = await cfgController.index();

      this.setRemainingQueriesWS();

      return res.send({ remainingQueriesWS });
    } catch (error) {
      // console.log(error);
      return res.status(400).send({ error: 'Não foi possível consultar!' });
    }
  }

  public async getEntitySN(req: Request, res: Response): Promise<Response> {
    try {
      const { cnpj } = req.body;

      const response = await this.api.get<ISintegraSN>('execute-api.php', {
        params: { token: this.token, cnpj, plugin: 'SN' },
      });

      return res.send(response.data);
    } catch (error) {
      // console.log(error);
      return res.status(400).send({ error: 'Não foi possível consultar!' });
    }
  }

  public async getEntityRF(req: Request, res: Response): Promise<Response> {
    try {
      const { cnpj } = req.body;

      const response = await this.api.get<ISintegraRF>('execute-api.php', {
        params: { token: this.token, cnpj, plugin: 'RF' },
      });

      return res.send(response.data);
    } catch (error) {
      // console.log(error);
      return res.status(400).send({ error: 'Não foi possível consultar!' });
    }
  }
}

export default new SintegraWS();
