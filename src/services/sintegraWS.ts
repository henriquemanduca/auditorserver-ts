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
  eventos_futuros_simples_nacional: string;
}

interface ISintegraRFCnae {
  text: string;
  code: string;
}

interface ISintegraRF extends IBaseSintegra {
  cnpj: string;
  cnpj_matriz: string;
  nome_empresarial: string;
  email: string;
  uf: string;
  municipio: string;
  bairro: string;
  logradouro: string;
  complemento: string;
  numero: string;
  cep: string;
  atividade_principal: ISintegraRFCnae[];
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

    // this.getEntitySN = this.getEntitySN.bind(this);
    this.getWsRemainingQueries = this.getWsRemainingQueries.bind(this);
    this.setWsRemainingQueries = this.setWsRemainingQueries.bind(this);
  }

  private setWsRemainingQueries(): void {
    this.api
      .get<ISintegraSaldo>('consulta-saldo.php', {
        params: { token: this.token },
      })
      .then((res) => {
        const remainingQueriesWS = Number(res.data.qtd_consultas_disponiveis);
        cfgController.setRemainingQueriesWS(remainingQueriesWS);
      });
  }

  public async getWsRemainingQueries(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { remainingQueriesWS } = await cfgController.index();

      this.setWsRemainingQueries();

      return res.send({ remainingQueriesWS });
    } catch (error) {
      // console.log(error);
      return res.status(400).send({ error: 'Não foi possível consultar!' });
    }
  }

  public async getEntitySN(cnpj: string): Promise<ISintegraSN> {
    try {
      const response = await this.api.get<ISintegraSN>('execute-api.php', {
        params: { token: this.token, cnpj, plugin: 'SN' },
      });

      return response.data;
    } catch (error) {
      // console.log(error);
      throw new Error(error);
    }
  }

  public async getEntityRF(cnpj: string): Promise<ISintegraRF> {
    try {
      const response = await this.api.get<ISintegraRF>('execute-api.php', {
        params: { token: this.token, cnpj, plugin: 'RF' },
      });

      return response.data;
    } catch (error) {
      // console.log(error);
      throw new Error(error);
    }
  }

  public async getWsEntitySN(req: Request, res: Response): Promise<Response> {
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

  public async getWsEntityRF(req: Request, res: Response): Promise<Response> {
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
