
## Dependencias

- nodejs >= 10
- dependencias locales de el proyecto: 
```sh
cd interface-zr1
npm install
```
- flow-bin:opcional (para el soporte en los editores de codigo si desea usar el soporte para tipos flow): 
```sh
npm install -g flow-bin
```
## Editando en visual studio code
Debe instalar el plugin `Flow language service` y luego debe deshabilitar el marcado de error typescript y javascript con las siguientes configuraciones:
```
"typescript.validate.enable": false,
"javascript.validate.enable": false,