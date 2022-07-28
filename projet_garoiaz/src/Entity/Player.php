<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\PlayerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use function Sodium\add;

/**
 * @ORM\Entity(repositoryClass=PlayerRepository::class)
 * @ApiResource()
 * @UniqueEntity(
 *     fields={"name"},
 *     errorPath="name",
 *     message="Player already exist"
 * )
 */
class Player
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups("player:read")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Groups("player:read")
     * @Assert\NotBlank()
     * @Assert\Length(min=3)
     */
    private $name;

    /**
     * @ORM\Column(type="array", nullable=true)
     */
    private $scores = [];



    public function __construct()
    {
        $this->scores = [];
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getScores(): array
    {
        return $this->scores;
    }

    public function setScores($score): self
    {
        if(in_array(null, $this->scores)) {
            array_shift($this->scores);
        }
        foreach ($score as $s){
            array_push($this->scores, $s);
        }
        return $this;
    }


}
