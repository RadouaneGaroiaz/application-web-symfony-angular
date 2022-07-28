<?php

namespace App\Controller;

use App\Entity\Player;
use App\Entity\Score;
use App\Repository\PlayerRepository;
use App\Repository\ScoreRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * @Route("/api")
 */
class GameController extends AbstractController
{
//    /**
//     * @Route("/game", name="game")
//     */
//    public function index()
//    {
//        return $this->render('game/index.html.twig', [
//            'controller_name' => 'GameController',
//        ]);
//    }

    /**
     * @Route("/players", methods={"GET"})
     */
    public function getPlayers(PlayerRepository $repository){
        return $this->json($repository->findAllProperties(), 200, ["Access-Control-Allow-Origin" =>   "*"], ["groups" => "player:read"]);
    }

    /**
     * @Route("/player/{name}", methods={"GET"})
     */
    public function getPlayer(PlayerRepository $repository, Player $player){
        return $this->json($repository->findPlayerByName($player->getName()), 200, ["Access-Control-Allow-Origin" =>   "*"], ["groups" => "score:read"]);
    }

    /**
     * @Route("/player/add", name="player_store", methods={"POST"})
     */
    public function storePlayer(Request $request, SerializerInterface $serializer, EntityManagerInterface $manager, ValidatorInterface $validator){
        $jsonRecu = $request->getContent();
        try {
            $player = $serializer->deserialize($jsonRecu, Player::class, 'json');

            $error = $validator->validate($player);
            if(count($error) > 0) {
                return $this->json($error, 400);
            }

            $manager->persist($player);
            $manager->flush();

            return $this->json($player, 201, []);
        }
        catch (NotEncodableValueException $e){
            return $this->json([
                'status' => 400,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * @Route("/player/addScore", name="score_store", methods={"POST"})
     */
    public function storeScore(Request $request, SerializerInterface $serializer, EntityManagerInterface $manager, ValidatorInterface $validator){
        $jsonRecu = $request->getContent();
        try {
            $player = $serializer->deserialize($jsonRecu, Player::class, 'json');

            $error = $validator->validate($player);
            if(count($error) > 0) {
                return $this->json($error, 400);
            }

            $manager->persist($player);
            $manager->flush();

            return $this->json($player, 201, []);
        }
        catch (NotEncodableValueException $e){
            return $this->json([
                'status' => 400,
                'message' => $e->getMessage()
            ]);
        }
    }

}
