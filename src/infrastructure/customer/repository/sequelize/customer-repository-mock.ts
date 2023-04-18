import CustomerRepositoryInterface from '../../../../domain/customer/repository/customer-repository.interface';


export default class CustomerRepositoryMock implements CustomerRepositoryInterface {
  async create(entity: any): Promise<void> {}
  async update(entity: any): Promise<void> {}
  async find(id: string): Promise<any> {}
  async findAll(): Promise<any> {}
}