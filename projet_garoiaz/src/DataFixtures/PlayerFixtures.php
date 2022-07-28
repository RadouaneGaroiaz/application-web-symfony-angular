<?php

namespace App\DataFixtures;

use App\Entity\Player;
use App\Entity\Score;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;

class PlayerFixtures extends Fixture implements OrderedFixtureInterface
{
    protected $faker;
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create();
        $maxPlayer = 15;

        // Player
        for ($i = 1; $i < $maxPlayer; ++$i) {
            $player = new Player();
            $player->setName($faker->name);
            $player->setScores([$faker->numberBetween(0, 1000)]);
            if($i%2 == 0){
                $player->setScores([$faker->numberBetween(0, 1000)]);
            }
            $manager->persist($player);
        }
        $manager->flush();
    }

    /**
     * @inheritDoc
     */
    public function getOrder()
    {
        return 1;
    }
}
