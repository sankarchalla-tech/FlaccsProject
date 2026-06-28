import * as queueService from "../services/queueService.js";

export async function queueSong(req,res){

    try{

        const row=await queueService.queueSong(
            req.params.songId
        );

        res.status(201).json(row);

    }

    catch(err){

        res.status(400).json({
            error:err.message
        });

    }

}

export async function getQueue(req,res){

    try{

        res.json(
            await queueService.getQueue()
        );

    }

    catch(err){

        res.status(500).json({
            error:err.message
        });

    }

}

export async function getQueueStats(req,res){

    try{

        res.json(
            await queueService.getQueueStats()
        );

    }

    catch(err){

        res.status(500).json({
            error:err.message
        });

    }

}

export async function queueMissingSongs(req, res) {
  try {
    const result = await queueService.queueMissingSongs();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
}