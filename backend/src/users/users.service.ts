import {
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
import {PrismaService} from 'prisma/prisma.service'
import  {Request} from 'express'


@Injectable()
export class UsersService {
    constructor(private prisma:PrismaService) {}
    async getMyUsers(id: number, req: Request) {
      try {
        // Convertir l'argument id en un nombre entier
        const userId = parseInt(id.toString(), 10); // Assurez-vous que id est bien un nombre
    
        const user = await this.prisma.user.findUnique({
          where: {
            id: userId, // Utilisez l'id converti en entier
          },
        });
    
        // Retournez un objet avec une propriété 'user' contenant la valeur de l'utilisateur
        return { user: user };
      } catch (error) {
        // Gérez l'erreur de conversion ici
        console.error("Erreur de conversion de l'ID en nombre entier :", error);
    
        // Vous pouvez lancer une exception personnalisée ou prendre d'autres mesures en cas d'erreur.
        // Par exemple, vous pouvez renvoyer un message d'erreur approprié.
        throw new Error("L'ID fourni n'est pas un nombre entier valide.");
      }
    }

    async getUsers() {
        return await this.prisma.user.findMany();
    }

/*
    La fonction GetInfoUser est cree afin de selectionner
    des informations precises
    Il suffit de rajouter un champ dans select:{id:true,email:true}
    pour avoir comme info que l email et l id 
*/

    async GetInfoUser() {
        return await this.prisma.user.findMany({select:{id : true}});
    }

    async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
        const user = await this.prisma.user.update({
          where: { id: userId },
          data: { twoFactorAuthenticationSecret: secret },
        });
    
        if (!user) {
          throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé.`);
        }
    
        return user;
      }
    
      async clearAllUsers(): Promise<void> {
        try {       
          await this.prisma.player.deleteMany();
          await this.prisma.user.deleteMany();
          console.log('All users have been deleted.');
        } catch (error) {
          console.error('Error deleting all users:', error);
        }
      }
      
    
    }
