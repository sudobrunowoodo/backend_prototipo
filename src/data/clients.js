/*
Senhas:  
    Maria = "123456";
    Jorge = "234456";
    Ana = "345678";
    Lucas = "456789";
*/

module.exports = [
    {id: 1, nomeUsuario: "MariaCliente", empresa: "Maria Advocacia", email: "mariacliente@email.com", senha: "$2b$10$1IzruFKDgMU4KR8N12T5yOqjEBSoCuJ2MMJcwiBRcW8zJL3xzWuES", permissao: "cliente", vagasId: [1]},
    {id: 2, nomeUsuario: "JorgeCliente", empresa: "Jorge Variedades", email: "jorgecliente@email.com", senha: "$2b$10$lWGpuFsAsjSTOmCn6iBGM.bYPSSsQW7x26Jajc9fSodns7q4Z7WuW", permissao: "cliente", vagasId: []},
    {id: 3, nomeUsuario: "AnaCliente", empresa: "Ana Contabilidade", email: "anacliente@email.com", senha: "$2b$10$9f7N/AuQYgmyH9jJwaojNO1/eqW9TBQNqwriIoQIZdCHcspBK2ve.", permissao: "cliente", vagasId: [2]},
    {id: 4, nomeUsuario: "LucasCliente", empresa: "Lucas Móveis Planejados", email: "lucascliente@email.com", senha: "$2b$10$1zdClg9lXLMKZHom7LN4COL/A7idZir/1asNzOcWkstrfl30xsHxu", permissao: "cliente", vagasId: [3]}
];